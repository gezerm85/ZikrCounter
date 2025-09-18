import { store } from "./src/redux/store";
import react, { useCallback, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./src/router/Navigation/Navigation";
import { Provider } from "react-redux";
import { useAppFonts } from "./src/utils/Fonts/Fonts";
import * as SplashScreen from "expo-splash-screen";
import "./src/i18n/i18n";
import { PaperProvider } from "react-native-paper";
import mobileAds from 'react-native-google-mobile-ads';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    // Google Mobile Ads'ı initialize et
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
      })
      .catch(error => {
        console.log('❌ Google Mobile Ads initialization error:', error);
      });
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <PaperProvider>
      <StatusBar style="auto" backgroundColor="transparent" translucent={true} />
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}
