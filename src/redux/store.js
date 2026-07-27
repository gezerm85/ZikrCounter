import { configureStore } from "@reduxjs/toolkit";
import CounterReducer from "./CounterSlice";
import SavedContentReducer from "./SavedContentSlice";
import ContentPrefsReducer from "./ContentPrefsSlice";

export const store = configureStore({
  reducer: {
    counter: CounterReducer,
    savedContent: SavedContentReducer,
    contentPrefs: ContentPrefsReducer,
  },
});
