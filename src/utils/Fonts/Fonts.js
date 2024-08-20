import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export const useAppFonts = () => {
  const [fontsLoaded] = useFonts({
    OpenSans: require("../../assets/fonts/OpenSans.ttf"),
    digital: require("../../assets/fonts/digital-7.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  return fontsLoaded;
};
