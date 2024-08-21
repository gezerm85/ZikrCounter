import { store } from "./src/redux/store";
import react, { useCallback } from "react";
import Navigation from "./src/router/Navigation/Navigation";
import { Provider } from "react-redux";
import { useAppFonts } from "./src/utils/Fonts/Fonts";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const fontsLoaded = useAppFonts();

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
      <Navigation />
    </Provider>
  );
}
