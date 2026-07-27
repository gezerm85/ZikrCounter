// Daily verse / hadith selection from the manually approved reference list.
//
// Verses are NEVER chosen at random from the whole Qur'an (spec): we rotate
// deterministically through DAILY_VERSE_REFERENCES and fetch the verified text
// from QuranEnc in the user's language at read/schedule time.

import { DAILY_VERSE_REFERENCES } from "../config/religiousContent";
import { getAyah, resolveTranslationKey } from "./QuranService";
import { getHadithList, getHadithDetail, getHadithCategories } from "./HadithService";

/** Day index (days since epoch, local) — stable within a day. */
export const dayIndex = (date = new Date()) =>
  Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);

/** Approved, enabled verse references in display order. */
export const getApprovedVerseRefs = () =>
  DAILY_VERSE_REFERENCES.filter((r) => r.enabled).sort((a, b) => a.displayOrder - b.displayOrder);

/**
 * The two verse references for today (slot 0 = morning, slot 1 = evening).
 * @param {number} [day]
 * @returns {[import('../config/religiousContent').DailyVerseReference, import('../config/religiousContent').DailyVerseReference]}
 */
export const pickDailyVerseRefs = (day = dayIndex()) => {
  const refs = getApprovedVerseRefs();
  if (refs.length === 0) return [null, null];
  const a = refs[(day * 2) % refs.length];
  const b = refs[(day * 2 + 1) % refs.length];
  return [a, b];
};

/**
 * Verified verse of the day for a slot, in the given content language.
 * @param {string} language
 * @param {number} [slot] 0 | 1
 * @returns {Promise<{verse:import('../models/quranModel').QuranVerse, ref:Object}>}
 */
export const getVerseOfDay = async (language, slot = 0, { signal } = {}) => {
  const ref = pickDailyVerseRefs()[slot] || pickDailyVerseRefs()[0];
  if (!ref) throw new Error("no approved verse references");
  const key = resolveTranslationKey(language);
  const verse = await getAyah(ref.surahNumber, ref.ayahNumber, key, { signal });
  return { verse, ref };
};

/**
 * A hadith of the day (verified, from HadeethEnc). Rotates deterministically
 * through a category's first page so the same day shows a stable hadith.
 * @param {string} language
 * @returns {Promise<import('../models/hadithModel').Hadith|null>}
 */
export const getHadithOfDay = async (language, { signal } = {}) => {
  const cats = await getHadithCategories(language, { signal });
  const usable = cats.filter((c) => (c.hadeethsCount || 0) > 0);
  if (usable.length === 0) return null;
  const cat = usable[dayIndex() % usable.length];
  const { items } = await getHadithList(language, 1, 20, cat.id, { signal });
  if (!items.length) return null;
  const item = items[dayIndex() % items.length];
  const { hadith } = await getHadithDetail(item.id, language, { signal, categoryLookup: cats });
  return hadith;
};
