// Redux slice for Quran/Hadith content preferences:
//  - contentLanguage: translation language for religious content ("tr"/"en"/"ar")
//    (kept independent from the app UI language, per spec)
//  - exploreTheme: "light" | "dark" for the new Keşfet design system
//  - reading settings: textScale, showArabic, showTranslation
//
// Persisted to AsyncStorage inline (same style as CounterSlice).

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { SUPPORTED_CONTENT_LANGUAGES } from "../config/religiousContent";

const STORAGE_KEY = "@zc/contentPrefs";

const deviceLang = () => {
  const tag = getLocales()?.[0]?.languageTag?.split("-")[0];
  return SUPPORTED_CONTENT_LANGUAGES.includes(tag) ? tag : "tr";
};

const defaults = {
  contentLanguage: deviceLang(),
  exploreTheme: "light",
  reading: { textScale: 1, showArabic: true, showTranslation: true },
};

export const hydrateContentPrefs = createAsyncThunk(
  "contentPrefs/hydrate",
  async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        ...defaults,
        ...parsed,
        reading: { ...defaults.reading, ...(parsed.reading || {}) },
      };
    } catch {
      return defaults;
    }
  }
);

const persist = (state) => {
  AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      contentLanguage: state.contentLanguage,
      exploreTheme: state.exploreTheme,
      reading: state.reading,
    })
  );
};

const clampScale = (v) => Math.min(1.6, Math.max(0.8, Math.round(v * 10) / 10));

const contentPrefsSlice = createSlice({
  name: "contentPrefs",
  initialState: { ...defaults, hydrated: false },
  reducers: {
    setContentLanguage: (state, action) => {
      if (SUPPORTED_CONTENT_LANGUAGES.includes(action.payload)) {
        state.contentLanguage = action.payload;
        persist(state);
      }
    },
    setExploreTheme: (state, action) => {
      state.exploreTheme = action.payload === "dark" ? "dark" : "light";
      persist(state);
    },
    toggleExploreTheme: (state) => {
      state.exploreTheme = state.exploreTheme === "dark" ? "light" : "dark";
      persist(state);
    },
    setTextScale: (state, action) => {
      state.reading.textScale = clampScale(Number(action.payload) || 1);
      persist(state);
    },
    incTextScale: (state) => {
      state.reading.textScale = clampScale(state.reading.textScale + 0.1);
      persist(state);
    },
    decTextScale: (state) => {
      state.reading.textScale = clampScale(state.reading.textScale - 0.1);
      persist(state);
    },
    setShowArabic: (state, action) => {
      state.reading.showArabic = !!action.payload;
      persist(state);
    },
    setShowTranslation: (state, action) => {
      state.reading.showTranslation = !!action.payload;
      persist(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateContentPrefs.fulfilled, (state, action) => {
      Object.assign(state, action.payload, { hydrated: true });
    });
  },
});

export const {
  setContentLanguage,
  setExploreTheme,
  toggleExploreTheme,
  setTextScale,
  incTextScale,
  decTextScale,
  setShowArabic,
  setShowTranslation,
} = contentPrefsSlice.actions;

export default contentPrefsSlice.reducer;
