// Internal Hadith models + normalizers for HadeethEnc responses.
//
// Integrity: normalization ONLY renames fields / coerces types. Text fields
// (hadeeth, explanation, hints, grade, attribution + their _ar variants) are
// copied verbatim. Missing optional fields become `undefined` (never invented).
//
// HadeethEnc shapes (verified live):
//   /categories/list/?language= -> [ {id,title,hadeeths_count,parent_id?} ]
//   /hadeeths/list/?language=&category_id=&page=&per_page=
//       -> { data:[{id,title,translations}], meta:{current_page,last_page,total_items,per_page} }
//   /hadeeths/one/?language=&id=
//       -> { id,title,hadeeth,attribution,grade,explanation,hints[],categories[],
//            translations[],hadeeth_intro,hadeeth_ar,explanation_ar,hints_ar,
//            attribution_ar,grade_ar,... }

/**
 * @typedef {Object} HadithCategory
 * @property {string} id
 * @property {string} name
 * @property {number} [hadeethsCount]
 * @property {string} [parentId]
 */

/**
 * @typedef {Object} HadithListItem
 * @property {string} id
 * @property {string} title
 * @property {string[]} [availableLanguages]
 */

/**
 * @typedef {Object} Hadith
 * @property {string} id
 * @property {string} title
 * @property {string} arabicText
 * @property {string} [intro]
 * @property {string} translation
 * @property {string} [explanation]
 * @property {string} [grade]
 * @property {string} [source]        // attribution
 * @property {string[]} [benefits]    // hints/lessons
 * @property {HadithCategory[]} categories
 * @property {string[]} [availableLanguages]
 * @property {string} language
 */

const cleanStr = (v) => (typeof v === "string" && v.trim().length > 0 ? v : undefined);
const cleanArr = (v) => (Array.isArray(v) && v.length > 0 ? v.filter((x) => typeof x === "string" && x.trim().length > 0) : undefined);

/**
 * @param {*} raw
 * @returns {HadithCategory}
 */
export const normalizeCategory = (raw) => ({
  id: String(raw?.id),
  name: raw?.title != null ? String(raw.title) : "",
  hadeethsCount: raw?.hadeeths_count != null ? Number(raw.hadeeths_count) : undefined,
  parentId: raw?.parent_id != null ? String(raw.parent_id) : undefined,
});

/**
 * @param {*} raw list item
 * @returns {HadithListItem}
 */
export const normalizeListItem = (raw) => ({
  id: String(raw?.id),
  title: raw?.title != null ? String(raw.title) : "",
  availableLanguages: cleanArr(raw?.translations),
});

/**
 * Normalize HadeethEnc pagination meta (fields come back as strings).
 * @param {*} meta
 * @returns {{currentPage:number,lastPage:number,totalItems:number,perPage:number}}
 */
export const normalizePagination = (meta) => ({
  currentPage: Number(meta?.current_page),
  lastPage: Number(meta?.last_page),
  totalItems: Number(meta?.total_items),
  perPage: Number(meta?.per_page),
});

/**
 * Normalize a full hadith. `language` is the requested translation language;
 * the Arabic original is always taken from the *_ar fields.
 * @param {*} raw
 * @param {string} language
 * @param {HadithCategory[]} [categoryLookup] optional id->category resolution
 * @returns {Hadith}
 */
export const normalizeHadith = (raw, language, categoryLookup) => {
  const catIds = Array.isArray(raw?.categories) ? raw.categories.map(String) : [];
  const categories = catIds.map((id) => {
    const found = categoryLookup && categoryLookup.find((c) => c.id === id);
    return found || { id, name: "" };
  });
  // For Arabic UI, the "translation" body is the Arabic text itself; expose an
  // empty translation so the UI shows only the Arabic block.
  const isArabic = (language || "").split("-")[0] === "ar";
  return {
    id: String(raw?.id),
    title: cleanStr(raw?.title) || "",
    arabicText: cleanStr(raw?.hadeeth_ar) || "",
    intro: isArabic ? cleanStr(raw?.hadeeth_intro_ar) : cleanStr(raw?.hadeeth_intro),
    translation: isArabic ? "" : cleanStr(raw?.hadeeth) || "",
    explanation: isArabic ? cleanStr(raw?.explanation_ar) : cleanStr(raw?.explanation),
    grade: isArabic ? cleanStr(raw?.grade_ar) : cleanStr(raw?.grade),
    source: isArabic ? cleanStr(raw?.attribution_ar) : cleanStr(raw?.attribution),
    benefits: isArabic ? cleanArr(raw?.hints_ar) : cleanArr(raw?.hints),
    categories,
    availableLanguages: cleanArr(raw?.translations),
    language,
  };
};
