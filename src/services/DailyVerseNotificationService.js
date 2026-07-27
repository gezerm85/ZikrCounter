// Two daily "Verse of the Day" notifications.
//
// Per spec: verses are taken ONLY from the manually approved reference list
// (never random from the whole Qur'an); the verified text is fetched from
// QuranEnc in the user's language, cached locally, tagged with the surah/ayah
// reference, and tapping opens that exact ayah in the reader.
//
// Content is baked for "today" at schedule time and refreshed whenever the app
// opens (same approach as the app's existing daily reminders). We append our
// own two notifications by fixed identifiers WITHOUT cancelling others.

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n/i18n";
import { pickDailyVerseRefs, getVerseOfDay } from "./dailyContentService";
import { getSurahMeta } from "../data/surahMeta";

const CACHE_KEY = "@zc/quran/dailyNotif";
const IDENTIFIERS = ["daily-verse-morning", "daily-verse-evening"];
const TIMES = [
  { hour: 8, minute: 30 },
  { hour: 20, minute: 30 },
];

/** Build a short notification body from a verified verse (no rewriting). */
const buildBody = (verse, ref) => {
  const meta = getSurahMeta(ref.surahNumber);
  const refLabel = `${meta?.turkishName || ref.surahNumber} ${ref.surahNumber}:${ref.ayahNumber}`;
  const text = verse.translation || verse.arabicText || "";
  return { body: `${text}\n— ${refLabel}`, refLabel };
};

/**
 * Schedule today's two daily verse notifications in the given content language.
 * Safe to call repeatedly (removes only its own prior notifications first).
 * @param {string} language "tr" | "en" | "ar"
 */
export const scheduleDailyVerseNotifications = async (language) => {
  try {
    // Remove only our own previous verse notifications (leave others intact).
    for (const id of IDENTIFIERS) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
        /* not scheduled yet */
      }
    }

    const refs = pickDailyVerseRefs();
    const cachePayload = [];

    for (let slot = 0; slot < 2; slot += 1) {
      const ref = refs[slot];
      if (!ref) continue;
      let verse;
      try {
        ({ verse } = await getVerseOfDay(language, slot));
      } catch {
        continue; // skip this slot if content can't be verified/fetched
      }
      const { body } = buildBody(verse, ref);
      cachePayload.push({ slot, surahNumber: ref.surahNumber, ayahNumber: ref.ayahNumber, verse });

      await Notifications.scheduleNotificationAsync({
        identifier: IDENTIFIERS[slot],
        content: {
          title: i18n.t("DAILY_VERSE"),
          body,
          sound: "default",
          data: {
            type: "daily_verse",
            screen: "QuranReader",
            surahNumber: ref.surahNumber,
            ayahNumber: ref.ayahNumber,
          },
        },
        trigger: {
          type: "daily",
          hour: TIMES[slot].hour,
          minute: TIMES[slot].minute,
          repeats: true,
        },
      });
    }

    // Cache the notification content locally (offline reference).
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), items: cachePayload }));
  } catch (error) {
    console.log("Daily verse notification scheduling failed:", error?.message);
  }
};

export const getCachedDailyVerses = async () => {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
