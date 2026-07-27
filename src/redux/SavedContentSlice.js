// Redux slice for saved verses/hadiths + last-read position.
// Mirrors the existing CounterSlice pattern: createAsyncThunk hydration from
// AsyncStorage + reducers that persist through the storage service.
//
// Offline-first: all of this data lives in AsyncStorage (contentStorage), so
// saved content and the last-read position work with no network.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as storage from "../services/contentStorage";

export const hydrateSavedContent = createAsyncThunk(
  "savedContent/hydrate",
  async () => {
    const [verses, hadiths, lastRead] = await Promise.all([
      storage.getSavedVerses(),
      storage.getSavedHadiths(),
      storage.getLastRead(),
    ]);
    return { verses, hadiths, lastRead };
  }
);

export const saveVerseThunk = createAsyncThunk(
  "savedContent/saveVerse",
  async (verse) => storage.saveVerse(verse)
);
export const removeVerseThunk = createAsyncThunk(
  "savedContent/removeVerse",
  async (verseId) => storage.removeSavedVerse(verseId)
);
export const saveHadithThunk = createAsyncThunk(
  "savedContent/saveHadith",
  async (hadith) => storage.saveHadith(hadith)
);
export const removeHadithThunk = createAsyncThunk(
  "savedContent/removeHadith",
  async (hadithId) => storage.removeSavedHadith(hadithId)
);
export const updateLastReadThunk = createAsyncThunk(
  "savedContent/updateLastRead",
  async (pos) => {
    await storage.setLastRead(pos);
    return storage.getLastRead();
  }
);

const initialState = {
  savedVerses: [],
  savedHadiths: [],
  lastRead: null,
  hydrated: false,
};

const savedContentSlice = createSlice({
  name: "savedContent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(hydrateSavedContent.fulfilled, (state, action) => {
        state.savedVerses = action.payload.verses || [];
        state.savedHadiths = action.payload.hadiths || [];
        state.lastRead = action.payload.lastRead || null;
        state.hydrated = true;
      })
      .addCase(saveVerseThunk.fulfilled, (state, action) => {
        state.savedVerses = action.payload || [];
      })
      .addCase(removeVerseThunk.fulfilled, (state, action) => {
        state.savedVerses = action.payload || [];
      })
      .addCase(saveHadithThunk.fulfilled, (state, action) => {
        state.savedHadiths = action.payload || [];
      })
      .addCase(removeHadithThunk.fulfilled, (state, action) => {
        state.savedHadiths = action.payload || [];
      })
      .addCase(updateLastReadThunk.fulfilled, (state, action) => {
        state.lastRead = action.payload || null;
      });
  },
});

export default savedContentSlice.reducer;
