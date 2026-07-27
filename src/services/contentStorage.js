// Offline storage for verified religious content, built on AsyncStorage (the
// app's existing storage technology — no new DB dependency).
//
// Stores, per spec:
//  - downloaded surahs (Arabic + translation, keyed by translation key)
//  - translation version + last-synchronization date
//  - saved verses / saved hadiths (offline)
//  - last-read position + recently viewed content
//  - recently viewed / saved hadith details (offline access)
//
// Safe replace strategy for surah download: write to a temp key, validate,
// then commit to the final key and drop the temp — old cached data is never
// removed until the new copy is validated & committed.
//
// Privacy: only content + minimal references are stored locally. Saved reading
// data is never sent to analytics or crash reports.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidSurah } from "../utils/contentValidation";

const K = {
  surah: (key, n) => `@zc/quran/surah/${key}/${n}`,
  surahTmp: (key, n) => `@zc/quran/surah_tmp/${key}/${n}`,
  version: (key) => `@zc/quran/version/${key}`,
  lastRead: "@zc/quran/lastRead",
  savedVerses: "@zc/saved/verses",
  savedHadiths: "@zc/saved/hadiths",
  hadithDetail: (lang, id) => `@zc/hadith/detail/${lang}/${id}`,
  recentHadiths: "@zc/hadith/recent",
};

const readJson = async (key, fallback = null) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

// ---- Quran surah cache -----------------------------------------------------

/**
 * Read a cached surah for a translation key (offline read).
 * @returns {Promise<import('../models/quranModel').QuranSurah|null>}
 */
export const getCachedSurah = async (translationKey, surahNumber) => {
  const entry = await readJson(K.surah(translationKey, surahNumber));
  return entry?.surah || null;
};

export const isSurahCached = async (translationKey, surahNumber) => {
  const entry = await readJson(K.surah(translationKey, surahNumber));
  return !!entry;
};

/**
 * Safe-replace store of a downloaded surah. Validates before committing so a
 * previously cached copy survives a failed/partial download.
 * @param {import('../models/quranModel').QuranSurah} surah
 * @param {{version?:string}} [meta]
 */
export const storeSurah = async (translationKey, surah, meta = {}) => {
  if (!isValidSurah(surah)) {
    throw new Error("refusing to cache invalid/unverified surah");
  }
  const tmpKey = K.surahTmp(translationKey, surah.number);
  const finalKey = K.surah(translationKey, surah.number);
  const payload = {
    surah,
    version: meta.version,
    cachedAt: Date.now(),
  };
  // 1. write temp  2. validate temp round-trips  3. commit  4. drop temp
  await writeJson(tmpKey, payload);
  const check = await readJson(tmpKey);
  if (!check || !isValidSurah(check.surah)) {
    await AsyncStorage.removeItem(tmpKey);
    throw new Error("surah failed post-write validation");
  }
  await writeJson(finalKey, payload);
  await AsyncStorage.removeItem(tmpKey);
  return payload;
};

// ---- Translation version / sync -------------------------------------------

/** @returns {Promise<{version?:string,lastSyncAt?:number}|null>} */
export const getStoredTranslationVersion = (translationKey) =>
  readJson(K.version(translationKey));

export const setStoredTranslationVersion = (translationKey, version) =>
  writeJson(K.version(translationKey), { version, lastSyncAt: Date.now() });

// ---- Last-read position ----------------------------------------------------

/**
 * @typedef {Object} LastRead
 * @property {number} surahNumber
 * @property {number} ayahNumber
 * @property {string} surahName
 * @property {string} translationKey
 * @property {number} updatedAt
 */

/** @returns {Promise<LastRead|null>} */
export const getLastRead = () => readJson(K.lastRead);

/** @param {Omit<LastRead,'updatedAt'>} pos */
export const setLastRead = (pos) => writeJson(K.lastRead, { ...pos, updatedAt: Date.now() });

// ---- Saved verses ----------------------------------------------------------

/** @returns {Promise<Array>} */
export const getSavedVerses = () => readJson(K.savedVerses, []).then((v) => v || []);

export const isVerseSaved = async (verseId) => {
  const list = await getSavedVerses();
  return list.some((v) => v.id === verseId);
};

/** @param {import('../models/quranModel').QuranVerse & {surahName?:string}} verse */
export const saveVerse = async (verse) => {
  const list = await getSavedVerses();
  if (list.some((v) => v.id === verse.id)) return list;
  const next = [{ ...verse, savedAt: Date.now() }, ...list];
  await writeJson(K.savedVerses, next);
  return next;
};

export const removeSavedVerse = async (verseId) => {
  const list = await getSavedVerses();
  const next = list.filter((v) => v.id !== verseId);
  await writeJson(K.savedVerses, next);
  return next;
};

// ---- Saved hadiths ---------------------------------------------------------

/** @returns {Promise<Array>} */
export const getSavedHadiths = () => readJson(K.savedHadiths, []).then((v) => v || []);

export const isHadithSaved = async (hadithId) => {
  const list = await getSavedHadiths();
  return list.some((h) => h.id === hadithId);
};

/** @param {import('../models/hadithModel').Hadith} hadith */
export const saveHadith = async (hadith) => {
  const list = await getSavedHadiths();
  if (list.some((h) => h.id === hadith.id)) return list;
  const next = [{ ...hadith, savedAt: Date.now() }, ...list];
  await writeJson(K.savedHadiths, next);
  return next;
};

export const removeSavedHadith = async (hadithId) => {
  const list = await getSavedHadiths();
  const next = list.filter((h) => h.id !== hadithId);
  await writeJson(K.savedHadiths, next);
  return next;
};

// ---- Hadith detail cache + recently viewed --------------------------------

export const getCachedHadith = (language, id) => readJson(K.hadithDetail(language, id));

export const cacheHadith = async (hadith) => {
  if (!hadith?.id) return;
  await writeJson(K.hadithDetail(hadith.language, hadith.id), hadith);
  // maintain a small recently-viewed list (references only)
  const recent = (await readJson(K.recentHadiths, [])) || [];
  const ref = { id: hadith.id, language: hadith.language, title: hadith.title, viewedAt: Date.now() };
  const next = [ref, ...recent.filter((r) => !(r.id === ref.id && r.language === ref.language))].slice(0, 30);
  await writeJson(K.recentHadiths, next);
};

export const getRecentHadiths = () => readJson(K.recentHadiths, []).then((v) => v || []);
