import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setTheme } from "../utils/Theme/Theme";

export const fetchStorage = createAsyncThunk(
  "storage/fetchStorage",
  async () => {
    const response = await AsyncStorage.getItem("value");
    const data = response ? JSON.parse(response) : 0;
    return data;
  }
);

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async () => {
    const response = await AsyncStorage.getItem("favorites");
    const data = response ? JSON.parse(response) : [];
    return data;
  }
);

export const fetchCurrentIndex = createAsyncThunk(
  "colors/fetchCurrentIndex",
  async () => {
    const response = await AsyncStorage.getItem("currentIndex");
    const data = response ? JSON.parse(response) : 0;
    return data;
  }
);
export const fetchVibrationEnabled = createAsyncThunk(
  "vibrationEnabled/fetchVibrationEnabled",
  async () => {
    const response = await AsyncStorage.getItem("vibrationEnabled");
    const data = response ? JSON.parse(response) : true;
    return data;
  }
);

const initialState = {
  value: 0,
  favorite: [],
  loading: false,
  error: null,
  vibrationEnabled: true,
  currentIndex: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
      AsyncStorage.setItem("value", JSON.stringify(state.value));
    },
    reset: (state) => {
      state.value = 0;
      AsyncStorage.removeItem("value");
    },
    setFavorite: (state, action) => {
      state.favorite.push(action.payload);
      AsyncStorage.setItem("favorites", JSON.stringify(state.favorite));
    },
    removeFavorite: (state, action) => {
      state.favorite = state.favorite.filter(
        (item) => item.id !== action.payload
      );
      AsyncStorage.setItem("favorites", JSON.stringify(state.favorite));
    },
    setVibrationEnabled: (state) => {
      state.vibrationEnabled = !state.vibrationEnabled;
      AsyncStorage.setItem(
        "vibrationEnabled",
        JSON.stringify(state.vibrationEnabled)
      );
    },
    changeGradientColor: (state) => {
      state.currentIndex = (state.currentIndex + 1) % setTheme.length;
      AsyncStorage.setItem("currentIndex", JSON.stringify(state.currentIndex));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(fetchStorage.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorite = action.payload || [];
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchCurrentIndex.fulfilled, (state, action) => {
        state.currentIndex = action.payload;
      })
      .addCase(fetchVibrationEnabled.fulfilled, (state, action) => {
        state.vibrationEnabled = action.payload;
      });
  },
});

export const {
  increment,
  reset,
  setFavorite,
  removeFavorite,
  setVibrationEnabled,
  changeGradientColor,
} = counterSlice.actions;

export default counterSlice.reducer;
