// Central configuration for verified religious-content sources.
//
// Integrity rules (see task spec):
//  - We only ever DISPLAY content returned by QuranEnc / HadeethEnc.
//  - We never generate, translate, shorten or correct Quran/Hadith text.
//  - Translation keys are confirmed against the live QuranEnc /translations/list
//    endpoint (do not invent keys).

// ---- API bases -------------------------------------------------------------
export const QURANENC_BASE = "https://quranenc.com/api/v1";
export const HADEETHENC_BASE = "https://hadeethenc.com/api/v1";

// ---- Supported languages ---------------------------------------------------
// UI language, Quran translation language and Hadith translation language are
// handled independently. Arabic (`ar`) shows the original Arabic text only.
export const SUPPORTED_CONTENT_LANGUAGES = ["tr", "en", "ar"];

// ---- Quran translation map -------------------------------------------------
// Confirmed keys from https://quranenc.com/api/v1/translations/list
//   tr: turkish_shahin | turkish_shaban | turkish_rwwad
//   en: english_saheeh | english_hilali_khan | english_rwwad
// `ar` intentionally has no key: the Arabic text is embedded in EVERY
// translation response (`arabic_text`), so for Arabic-only mode we fetch a
// default translation and render only the Arabic field.
export const QURAN_TRANSLATIONS = {
  tr: "turkish_shahin",
  en: "english_saheeh",
};

// Fallback translation used to obtain Arabic text when the UI language is `ar`
// or when a language has no configured translation key.
export const QURAN_ARABIC_SOURCE_KEY = "turkish_shahin";

/**
 * Resolve the QuranEnc translation key for a content language.
 * Returns the configured key, or the Arabic source key as a safe fallback.
 * @param {string} language "tr" | "en" | "ar"
 * @returns {string} translation key (never empty)
 */
export const getTranslationKey = (language) => {
  const lang = (language || "tr").split("-")[0];
  return QURAN_TRANSLATIONS[lang] || QURAN_ARABIC_SOURCE_KEY;
};

/**
 * Whether the given content language should render the translation text
 * (false for pure Arabic mode, where only `arabic_text` is shown).
 * @param {string} language
 * @returns {boolean}
 */
export const showsTranslation = (language) => {
  const lang = (language || "tr").split("-")[0];
  return Boolean(QURAN_TRANSLATIONS[lang]);
};

// ---- Networking policy -----------------------------------------------------
export const NETWORK_CONFIG = {
  timeoutMs: 15000,
  maxRetries: 2, // retries for network failures / 5xx only (never 4xx)
  retryBaseDelayMs: 600,
  hadithDefaultPerPage: 20,
};

// ---- Daily verse references ------------------------------------------------
// Manually approved short verses for the two daily notifications.
// We store ONLY references here; the verified text is fetched from QuranEnc at
// schedule time in the user's language. Keep verses short so no rewriting is
// ever needed (if too long, replace with a shorter approved reference).
/**
 * @typedef {Object} DailyVerseReference
 * @property {string} id
 * @property {number} surahNumber
 * @property {number} ayahNumber
 * @property {string} category
 * @property {boolean} enabled
 * @property {number} displayOrder
 */
/** @type {DailyVerseReference[]} */
export const DAILY_VERSE_REFERENCES = [
  { id: "dv-002-286", surahNumber: 2, ayahNumber: 286, category: "reliance", enabled: true, displayOrder: 1 },
  { id: "dv-094-005", surahNumber: 94, ayahNumber: 5, category: "hope", enabled: true, displayOrder: 2 },
  { id: "dv-094-006", surahNumber: 94, ayahNumber: 6, category: "hope", enabled: true, displayOrder: 3 },
  { id: "dv-065-003", surahNumber: 65, ayahNumber: 3, category: "reliance", enabled: true, displayOrder: 4 },
  { id: "dv-013-028", surahNumber: 13, ayahNumber: 28, category: "remembrance", enabled: true, displayOrder: 5 },
  { id: "dv-002-152", surahNumber: 2, ayahNumber: 152, category: "remembrance", enabled: true, displayOrder: 6 },
  { id: "dv-003-139", surahNumber: 3, ayahNumber: 139, category: "hope", enabled: true, displayOrder: 7 },
  { id: "dv-039-053", surahNumber: 39, ayahNumber: 53, category: "mercy", enabled: true, displayOrder: 8 },
  { id: "dv-055-013", surahNumber: 55, ayahNumber: 13, category: "gratitude", enabled: true, displayOrder: 9 },
  { id: "dv-002-153", surahNumber: 2, ayahNumber: 153, category: "patience", enabled: true, displayOrder: 10 },
];

// ---- Attribution -----------------------------------------------------------
export const ATTRIBUTION = {
  quran: {
    source: "QuranEnc.com",
    url: "https://quranenc.com",
  },
  hadith: {
    source: "HadeethEnc.com",
    url: "https://hadeethenc.com",
  },
};
