// HadeethEnc service — verified hadith content.
//
// Responsibilities: categories, paginated list, single hadith detail, saved
// CRUD, offline cache and client-side search. Responses are normalized
// (models/hadithModel) and validated. Explanation/grade/source/benefits are
// surfaced only when the API returns them (never invented).

import { createClient, getJson, ApiError } from "./apiClient";
import { HADEETHENC_BASE, NETWORK_CONFIG } from "../config/religiousContent";
import {
  normalizeCategory,
  normalizeListItem,
  normalizePagination,
  normalizeHadith,
} from "../models/hadithModel";
import { isValidHadith, isValidPagination } from "../utils/contentValidation";
import {
  getCachedHadith,
  cacheHadith,
  getSavedHadiths,
  saveHadith,
  removeSavedHadith,
  isHadithSaved,
} from "./contentStorage";

const client = createClient(HADEETHENC_BASE);

const langOf = (language) => (language || "tr").split("-")[0];

/**
 * Hadith categories for a language.
 * @returns {Promise<import('../models/hadithModel').HadithCategory[]>}
 */
export const getHadithCategories = async (language, { signal } = {}) => {
  const lang = langOf(language);
  const data = await getJson(client, "/categories/list/", {
    params: { language: lang },
    signal,
    dedupeKey: `hadith:categories:${lang}`,
    validate: (d) => Array.isArray(d),
  });
  return data.map(normalizeCategory);
};

/**
 * Paginated hadith list (optionally filtered by category).
 * @param {string} language
 * @param {number} [page]
 * @param {number} [perPage]
 * @param {string} [categoryId]
 * @returns {Promise<{items:Array, pagination:Object}>}
 */
export const getHadithList = async (
  language,
  page = 1,
  perPage = NETWORK_CONFIG.hadithDefaultPerPage,
  categoryId,
  { signal } = {}
) => {
  const lang = langOf(language);
  const params = { language: lang, page, per_page: perPage };
  if (categoryId != null) params.category_id = categoryId;
  const data = await getJson(client, "/hadeeths/list/", {
    params,
    signal,
    dedupeKey: `hadith:list:${lang}:${categoryId ?? "all"}:${page}:${perPage}`,
    validate: (d) => Array.isArray(d?.data) && d?.meta != null,
  });
  const pagination = normalizePagination(data.meta);
  if (!isValidPagination(pagination)) {
    // pagination is advisory; clamp instead of failing the whole list
    pagination.currentPage = pagination.currentPage || page;
    pagination.lastPage = pagination.lastPage || page;
  }
  return {
    items: data.data.map(normalizeListItem),
    pagination,
  };
};

/**
 * Full hadith detail. On offline error, falls back to cache.
 * @returns {Promise<{hadith:import('../models/hadithModel').Hadith, fromCache:boolean}>}
 */
export const getHadithDetail = async (id, language, opts = {}) => {
  const { signal, categoryLookup, allowCacheFallback = true } = opts;
  const lang = langOf(language);
  try {
    const data = await getJson(client, "/hadeeths/one/", {
      params: { language: lang, id },
      signal,
      dedupeKey: `hadith:one:${lang}:${id}`,
      validate: (d) => d?.id != null,
    });
    const hadith = normalizeHadith(data, lang, categoryLookup);
    if (!isValidHadith(hadith)) throw new ApiError("INVALID", "invalid hadith");
    await cacheHadith(hadith);
    return { hadith, fromCache: false };
  } catch (err) {
    if (allowCacheFallback && err instanceof ApiError && err.isOffline) {
      const cached = await getCachedHadith(lang, id);
      if (cached) return { hadith: cached, fromCache: true };
    }
    throw err;
  }
};

/**
 * Client-side search over a set of already-loaded list items (HadeethEnc has
 * no documented public search endpoint; we filter titles/previews locally).
 * @param {Array} items normalized list items
 * @param {string} query
 */
export const filterHadithItems = (items, query) => {
  const q = (query || "").trim().toLocaleLowerCase();
  if (!q) return items;
  return (items || []).filter((it) => (it.title || "").toLocaleLowerCase().includes(q));
};

/**
 * Convenience search: pull the first page(s) for a language/category and filter
 * locally. Bounded to avoid unbounded paging.
 * @returns {Promise<Array>}
 */
export const searchHadiths = async (query, language, { categoryId, maxPages = 3, signal } = {}) => {
  const collected = [];
  let page = 1;
  let lastPage = 1;
  do {
    const { items, pagination } = await getHadithList(language, page, 50, categoryId, { signal });
    collected.push(...items);
    lastPage = pagination.lastPage || 1;
    page += 1;
  } while (page <= lastPage && page <= maxPages);
  return filterHadithItems(collected, query);
};

// ---- Saved hadith passthrough (offline) -----------------------------------
export {
  getSavedHadiths,
  saveHadith,
  removeSavedHadith,
  isHadithSaved,
};
