import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  BannerAd,
  TestIds,
  BannerAdSize,
} from "react-native-google-mobile-ads";

const AdBanner = () => {
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-9856483340336068/4640385604";

  return (
    <View style={styles.container}>
      <BannerAd
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        unitId={adUnitId}
      />
    </View>
  );
};

export default AdBanner;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
