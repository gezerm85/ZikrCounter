import React, { useState, useEffect } from "react";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const InterstitialAdComponent = ({ clickCount, onAdClosed, adCouner }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        interstitialAd.load(); // Reklam kapatıldıktan sonra yeni reklam yükle
        onAdClosed(); // Reklam kapatıldığında tıklama sayacını sıfırla
      }
    );

    interstitialAd.load(); // Reklamı yüklemeye başla

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  useEffect(() => {
    if (loaded && clickCount !== 0 && clickCount % adCouner === 0) {
      interstitialAd.show();
    }
  }, [clickCount, loaded]);

  return null;
};

export default InterstitialAdComponent;
