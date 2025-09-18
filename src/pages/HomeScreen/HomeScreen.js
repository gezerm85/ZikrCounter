import { View, StatusBar, StyleSheet, Dimensions, Text } from "react-native";
import React, { useState } from "react";
import ZikirCounter from "../../components/ZikirCounter/ZikirCounter";
import { useSelector } from "react-redux";
import { fixedColors } from "../../utils/Theme/VectorTheme";
import AdBanner from "../../components/AdBanner/AdBanner";
import InterstitialAd from "../../components/InterstitialAd/InterstitialAd";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
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

  const { t } = useTranslation();

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
      style={[
        styles.container,
        { backgroundColor: fixedColors.bgColor },
      ]}
      accessible={true}
      accessibilityLabel={"Home1"}
    >
      <StatusBar barStyle="default" />

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
    height: "90%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    width: "100%",
    height: 80, // Sabit yükseklik
    minHeight: 80,
  },
});