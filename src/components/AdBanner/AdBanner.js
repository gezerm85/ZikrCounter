import { StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import {
  BannerAd,
  TestIds,
  BannerAdSize,
  AdEventType,
} from "react-native-google-mobile-ads";

const AdBanner = () => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  
  // Environment-based reklam ID'si
  const adUnitId = __DEV__ 
    ? TestIds.BANNER 
    : "YOUR_PRODUCTION_BANNER_ID_HERE"; // Production Banner ID - Replace with your AdMob ID

  const handleAdLoaded = () => {
    setAdLoaded(true);
    setAdError(false);
  };

  const handleAdError = (error) => {
    console.log('❌ Banner ad error:', error);
    setAdError(true);
    setAdLoaded(false);
  };

  return (
    <View style={styles.container}>
      {!adError ? (
        <BannerAd
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          unitId={adUnitId}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdError}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Reklam yüklenemedi</Text>
        </View>
      )}
    </View>
  );
};

export default AdBanner;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  errorText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontFamily: "OpenSans",
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontFamily: "OpenSans",
  },
});
