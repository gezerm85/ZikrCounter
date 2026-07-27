// Lightweight schema validation for verified religious content.
//
// The project has no validation library, so these are small hand-written
// guards (spec: "use a lightweight schema validation approach").
//
// IMPORTANT: validation NEVER mutates religious text. It only checks that the
// required identifiers / fields are present and well-typed. Callers treat a
// failed validation as "content could not be verified" and show the standard
// unavailable state instead of rendering partial/normalized-away scripture.

/** @param {*} v */
export const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

/** @param {*} v */
export const isPositiveInt = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0;
};

/**
 * Validate a normalized Quran verse.
 * arabicText is required (the original is always present); translation may be
 * empty for pure-Arabic mode.
 * @param {*} verse
 * @returns {boolean}
 */
export const isValidVerse = (verse) =>
  !!verse &&
  isPositiveInt(verse.surahNumber) &&
  isPositiveInt(verse.ayahNumber) &&
  isNonEmptyString(verse.arabicText);

/**
 * Validate a normalized surah (metadata + at least one valid verse).
 * @param {*} surah
 * @returns {boolean}
 */
export const isValidSurah = (surah) =>
  !!surah &&
  isPositiveInt(surah.number) &&
  Array.isArray(surah.verses) &&
  surah.verses.length > 0 &&
  surah.verses.every(isValidVerse);

/**
 * Validate a normalized hadith. Only id + arabicText + translation are
 * required; grade/source/explanation/categories are optional and hidden when
 * absent (never invented).
 * @param {*} hadith
 * @returns {boolean}
 */
export const isValidHadith = (hadith) =>
  !!hadith &&
  isNonEmptyString(hadith.id) &&
  (isNonEmptyString(hadith.arabicText) || isNonEmptyString(hadith.translation));

/**
 * Validate HadeethEnc pagination meta (fields can arrive as strings).
 * @param {*} meta
 * @returns {boolean}
 */
export const isValidPagination = (meta) =>
  !!meta &&
  isPositiveInt(meta.currentPage) &&
  isPositiveInt(meta.lastPage) &&
  Number.isInteger(Number(meta.totalItems));

/** Assert helper: throws a tagged error used by services to branch on. */
export class ContentValidationError extends Error {
  constructor(message) {
    super(message || "content_not_verified");
    this.name = "ContentValidationError";
    this.code = "CONTENT_NOT_VERIFIED";
  }
}
