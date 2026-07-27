// Internal Quran models + normalizers for QuranEnc responses.
//
// Integrity: normalization ONLY renames fields and coerces id/number types.
// arabic_text, translation and footnotes are copied verbatim — never trimmed,
// reshaped, merged or otherwise altered.
//
// QuranEnc shapes (verified live):
//   /translation/sura/{key}/{sura} -> { result: [ {id,sura,aya,arabic_text,translation,footnotes} ] }
//   /translation/aya/{key}/{sura}/{aya} -> { result: {id,sura,aya,arabic_text,translation,footnotes} }
//   /translations/list -> { translations: [ {key,language_iso_code,version,last_update,title,...} ] }

import { getSurahMeta } from "../data/surahMeta";
import { showsTranslation } from "../config/religiousContent";

/**
 * @typedef {Object} QuranVerse
 * @property {string} id            unique key `${surah}:${ayah}`
 * @property {number} surahNumber
 * @property {number} ayahNumber
 * @property {string} arabicText    verbatim Arabic (never altered)
 * @property {string} translation   verbatim translation ("" in pure-Arabic mode)
 * @property {string} [footnotes]   verbatim footnotes if provided
 * @property {string} translationKey
 * @property {string} translationLanguage
 */

/**
 * @typedef {Object} QuranSurah
 * @property {number} number
 * @property {string} localizedName
 * @property {string} arabicName
 * @property {number} ayahCount
 * @property {string} [revelationType]
 * @property {QuranVerse[]} verses
 * @property {string} translationKey
 * @property {string} translationLanguage
 */

/**
 * Normalize a single raw QuranEnc ayah object.
 * @param {*} raw
 * @param {{translationKey:string, language:string}} ctx
 * @returns {QuranVerse}
 */
export const normalizeVerse = (raw, ctx) => {
  const surahNumber = Number(raw?.sura);
  const ayahNumber = Number(raw?.aya);
  const includeTranslation = showsTranslation(ctx?.language);
  return {
    id: `${surahNumber}:${ayahNumber}`,
    surahNumber,
    ayahNumber,
    arabicText: typeof raw?.arabic_text === "string" ? raw.arabic_text : "",
    // In pure-Arabic mode we deliberately do not surface a translation.
    translation:
      includeTranslation && typeof raw?.translation === "string" ? raw.translation : "",
    footnotes:
      includeTranslation && typeof raw?.footnotes === "string" && raw.footnotes.length > 0
        ? raw.footnotes
        : undefined,
    translationKey: ctx?.translationKey,
    translationLanguage: ctx?.language,
  };
};

/**
 * Normalize a full surah from the QuranEnc sura response `result` array.
 * @param {number} surahNumber
 * @param {Array} rawVerses
 * @param {{translationKey:string, language:string}} ctx
 * @returns {QuranSurah}
 */
export const normalizeSurah = (surahNumber, rawVerses, ctx) => {
  const meta = getSurahMeta(surahNumber) || {};
  const verses = Array.isArray(rawVerses)
    ? rawVerses.map((v) => normalizeVerse(v, ctx))
    : [];
  return {
    number: Number(surahNumber),
    localizedName: meta.turkishName || String(surahNumber),
    arabicName: meta.arabicName || "",
    ayahCount: meta.ayahCount || verses.length,
    revelationType: meta.revelationType,
    verses,
    translationKey: ctx?.translationKey,
    translationLanguage: ctx?.language,
  };
};

/**
 * @typedef {Object} QuranTranslationInfo
 * @property {string} key
 * @property {string} language
 * @property {string} title
 * @property {string} [version]
 * @property {number} [lastUpdate]  unix seconds
 * @property {string} [direction]
 */

/**
 * Normalize one entry from /translations/list.
 * @param {*} raw
 * @returns {QuranTranslationInfo}
 */
export const normalizeTranslationInfo = (raw) => ({
  key: raw?.key,
  language: raw?.language_iso_code,
  title: raw?.title,
  version: raw?.version,
  lastUpdate: raw?.last_update != null ? Number(raw.last_update) : undefined,
  direction: raw?.direction,
});
