// QuranEnc service — verified Quran text & translations.
//
// Responsibilities: fetch translation list, surah, single ayah; cache surahs;
// read cached surahs offline; sync translation version. All responses are
// normalized (models/quranModel) and validated before use. Religious text is
// never generated or altered here.

import { createClient, getJson, ApiError, ApiErrorCodes } from "./apiClient";
import { QURANENC_BASE, getTranslationKey } from "../config/religiousContent";
import { SURAH_META, getSurahMeta } from "../data/surahMeta";
import {
  normalizeSurah,
  normalizeVerse,
  normalizeTranslationInfo,
} from "../models/quranModel";
import { isValidSurah, isValidVerse, ContentValidationError } from "../utils/contentValidation";
import {
  getCachedSurah as readCachedSurah,
  storeSurah,
  getStoredTranslationVersion,
  setStoredTranslationVersion,
} from "./contentStorage";

const client = createClient(QURANENC_BASE);

/**
 * Local list of the 114 surahs (static metadata — no network needed).
 * @returns {import('../data/surahMeta').SURAH_META}
 */
export const getSurahList = () => SURAH_META;

/** Resolve translation key from a content language ("tr"/"en"/"ar"). */
export const resolveTranslationKey = (language) => getTranslationKey(language);

/**
 * Get available translations, optionally filtered to a language.
 * @param {string} [language]
 */
export const getQuranTranslations = async (language, { signal } = {}) => {
  const data = await getJson(client, "/translations/list", {
    signal,
    dedupeKey: "quran:translations",
    validate: (d) => Array.isArray(d?.translations),
  });
  const list = data.translations.map(normalizeTranslationInfo);
  if (!language) return list;
  const lang = language.split("-")[0];
  return list.filter((t) => t.language === lang);
};

/**
 * Fetch a full surah for a translation key. On a network/offline error, falls
 * back to the cached copy when available.
 * @param {number} surahNumber
 * @param {string} translationKey
 * @param {{signal?:AbortSignal, allowCacheFallback?:boolean}} [opts]
 * @returns {Promise<{surah:import('../models/quranModel').QuranSurah, fromCache:boolean}>}
 */
export const getSurah = async (surahNumber, translationKey, opts = {}) => {
  const { signal, allowCacheFallback = true } = opts;
  const language = translationKeyLanguage(translationKey);
  try {
    const data = await getJson(client, `/translation/sura/${translationKey}/${surahNumber}`, {
      signal,
      dedupeKey: `quran:sura:${translationKey}:${surahNumber}`,
      validate: (d) => Array.isArray(d?.result) && d.result.length > 0,
    });
    const surah = normalizeSurah(surahNumber, data.result, { translationKey, language });
    if (!isValidSurah(surah)) throw new ContentValidationError();
    return { surah, fromCache: false };
  } catch (err) {
    if (allowCacheFallback && err instanceof ApiError && err.isOffline) {
      const cached = await readCachedSurah(translationKey, surahNumber);
      if (cached) return { surah: cached, fromCache: true };
    }
    throw err;
  }
};

/**
 * Fetch a single ayah.
 * @returns {Promise<import('../models/quranModel').QuranVerse>}
 */
export const getAyah = async (surahNumber, ayahNumber, translationKey, { signal } = {}) => {
  const language = translationKeyLanguage(translationKey);
  const data = await getJson(client, `/translation/aya/${translationKey}/${surahNumber}/${ayahNumber}`, {
    signal,
    dedupeKey: `quran:aya:${translationKey}:${surahNumber}:${ayahNumber}`,
    validate: (d) => d?.result && d.result.aya != null,
  });
  const verse = normalizeVerse(data.result, { translationKey, language });
  if (!isValidVerse(verse)) throw new ContentValidationError();
  return verse;
};

/** Read a cached surah directly (offline). */
export const getCachedSurah = (surahNumber, translationKey) =>
  readCachedSurah(translationKey, surahNumber);

/**
 * Download a surah and persist it (safe replace). Returns the stored surah.
 * @returns {Promise<import('../models/quranModel').QuranSurah>}
 */
export const downloadSurah = async (surahNumber, translationKey, { signal } = {}) => {
  const { surah } = await getSurah(surahNumber, translationKey, { signal, allowCacheFallback: false });
  const version = await getRemoteVersion(translationKey, { signal }).catch(() => undefined);
  await storeSurah(translationKey, surah, { version });
  return surah;
};

/** Remote version string for a translation key (from /translations/list). */
export const getRemoteVersion = async (translationKey, { signal } = {}) => {
  const list = await getQuranTranslations(undefined, { signal });
  const info = list.find((t) => t.key === translationKey);
  return info?.version;
};

/**
 * Current sync version info for a translation key: stored vs remote.
 * @returns {Promise<{translationKey:string, storedVersion?:string, remoteVersion?:string, lastSyncAt?:number}>}
 */
export const getQuranSyncVersion = async (translationKey, { signal } = {}) => {
  const stored = await getStoredTranslationVersion(translationKey);
  let remoteVersion;
  try {
    remoteVersion = await getRemoteVersion(translationKey, { signal });
  } catch {
    remoteVersion = undefined;
  }
  return {
    translationKey,
    storedVersion: stored?.version,
    remoteVersion,
    lastSyncAt: stored?.lastSyncAt,
  };
};

/**
 * Synchronize the stored translation version marker. Returns whether the
 * remote version differs from what we last stored (callers may then re-download
 * cached surahs). Does NOT delete existing caches.
 */
export const syncTranslationVersion = async (translationKey, { signal } = {}) => {
  const info = await getQuranSyncVersion(translationKey, { signal });
  const changed =
    info.remoteVersion != null && info.remoteVersion !== info.storedVersion;
  if (info.remoteVersion != null) {
    await setStoredTranslationVersion(translationKey, info.remoteVersion);
  }
  return { changed, version: info.remoteVersion };
};

// Reverse-map a translation key to its language (best effort, for models).
import { QURAN_TRANSLATIONS } from "../config/religiousContent";
function translationKeyLanguage(translationKey) {
  const entry = Object.entries(QURAN_TRANSLATIONS).find(([, k]) => k === translationKey);
  return entry ? entry[0] : "tr";
}

export { getSurahMeta };
