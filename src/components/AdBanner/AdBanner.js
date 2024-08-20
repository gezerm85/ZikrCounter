import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AdMobBanner } from "expo-ads-admob";

const AdBanner = () => {
  return (
    <View style={styles.container}>
      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-9856483340336068~6907821252"
        koyun
        servePersonalizedAds
        onDidFailToReceiveAdWithError={(error) => console.error(error)}
      />
    </View>
  );
};

export default AdBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
