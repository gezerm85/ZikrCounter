import { View, StatusBar, StyleSheet } from "react-native";
import React, { useState } from "react";
import ZikirCounter from "../../components/ZikirCounter/ZikirCounter";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import AdBanner from "../../components/AdBanner/AdBanner";
import InterstitialAd from "../../components/InterstitialAd/InterstitialAd";

const HomeScreen = () => {
  const { c, mode } = useExploreTheme();

  const [clickCounts, setClickCounts] = useState({
    button: 0,
    button1: 0,
    button2: 0,
    button3: 0,
    button4: 0,
  });

  const thresholds = {
    button: 5,
    button1: 10,
    button2: 15,
    button3: 25,
    button4: 100,
  };

  const handleButtonClick = (buttonKey) => {
    setClickCounts((prevCounts) => {
      const newCount = prevCounts[buttonKey] + 1;
      return { ...prevCounts, [buttonKey]: newCount };
    });
  };

  const resetClickCount = (buttonKey) => {
    setClickCounts((prevCounts) => ({ ...prevCounts, [buttonKey]: 0 }));
  };

  return (
    <View
      style={[styles.container, { backgroundColor: c.bg }]}
      accessible={true}
      accessibilityLabel={"Home1"}
    >
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <View style={styles.bodyContainer}>
        <ZikirCounter onButtonClick={handleButtonClick} />
      </View>

      <View style={styles.bottomContainer}>
        <AdBanner />
      </View>

      {Object.keys(clickCounts).map((buttonKey) => (
        <InterstitialAd
          key={buttonKey}
          clickCount={clickCounts[buttonKey]}
          onAdClosed={() => resetClickCount(buttonKey)}
          adCouner={thresholds[buttonKey]}
        />
      ))}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  bodyContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    width: "100%",
    height: 80,
    minHeight: 80,
  },
});
