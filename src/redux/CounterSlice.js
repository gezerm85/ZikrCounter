import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { vectorThemes } from "../utils/Theme/VectorTheme";

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
// Vibration removed - using default behavior
export const fetchFontSize = createAsyncThunk(
  "FontSize/fetchFontSize",
  async () => {
    const response = await AsyncStorage.getItem("fontSize");
    const data = response ? JSON.parse(response) : 68;
    return data;
  }
);

export const fetchSelectedCity = createAsyncThunk(
  "city/fetchSelectedCity",
  async () => {
    const response = await AsyncStorage.getItem("selectedCity");
    const data = response ? JSON.parse(response) : { id: 34, name: 'İstanbul', code: 'istanbul' };
    return data;
  }
);

export const fetchPrayerTimes = createAsyncThunk(
  "prayerTimes/fetchPrayerTimes",
  async (cityName = 'Istanbul') => {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${cityName}&country=Turkey&method=13&timezonestring=Europe/Istanbul`
    );
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    } else {
      throw new Error('Prayer times could not be loaded');
    }
  }
);

const initialState = {
  value: 0,
  favorite: [],
  loading: false,
  error: null,
  currentIndex: 0,
  fontSize: 68,
  selectedCity: { id: 34, name: 'İstanbul', code: 'istanbul' },
  prayerTimes: null,
  prayerTimesLoading: false,
  prayerTimesError: null,
  prayerNotifications: [],
  notificationPermission: false,
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
    updateFavorite: (state, action) => {
      const { id, fav, counter, date } = action.payload;
      const index = state.favorite.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.favorite[index] = {
          ...state.favorite[index],
          fav,
          counter,
          date,
        };
      }
      AsyncStorage.setItem("favorites", JSON.stringify(state.favorite));
    },
    removeFavorite: (state, action) => {
      state.favorite = state.favorite.filter(
        (item) => item.id !== action.payload
      );
      AsyncStorage.setItem("favorites", JSON.stringify(state.favorite));
    },
    // Vibration removed - using default behavior
    changeGradientColor: (state) => {
      state.currentIndex = (state.currentIndex + 1) % vectorThemes.length;
      AsyncStorage.setItem("currentIndex", JSON.stringify(state.currentIndex));
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      AsyncStorage.setItem("fontSize", JSON.stringify(state.fontSize));
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
      AsyncStorage.setItem("currentIndex", JSON.stringify(state.currentIndex));
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
      AsyncStorage.setItem("selectedCity", JSON.stringify(state.selectedCity));
    },
    setNotificationPermission: (state, action) => {
      state.notificationPermission = action.payload;
    },
    setPrayerNotifications: (state, action) => {
      state.prayerNotifications = action.payload;
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
      // Vibration removed - using default behavior
      .addCase(fetchFontSize.fulfilled, (state, action) => {
        state.fontSize = action.payload;
      })
      .addCase(fetchSelectedCity.fulfilled, (state, action) => {
        state.selectedCity = action.payload;
      })
      .addCase(fetchPrayerTimes.pending, (state) => {
        state.prayerTimesLoading = true;
        state.prayerTimesError = null;
      })
      .addCase(fetchPrayerTimes.fulfilled, (state, action) => {
        state.prayerTimesLoading = false;
        state.prayerTimes = action.payload;
        state.prayerTimesError = null;
      })
      .addCase(fetchPrayerTimes.rejected, (state, action) => {
        state.prayerTimesLoading = false;
        state.prayerTimesError = action.error.message;
      });
  },
});

export const {
  increment,
  reset,
  setFavorite,
  removeFavorite,
  changeGradientColor,
  setFontSize,
  setCurrentIndex,
  setSelectedCity,
  setNotificationPermission,
  setPrayerNotifications,
  updateFavorite,
} = counterSlice.actions;

export default counterSlice.reducer;
