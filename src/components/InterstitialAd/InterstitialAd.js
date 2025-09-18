import { useState, useEffect } from "react";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

// Environment-based reklam ID'si
const adUnitId = __DEV__ 
  ? TestIds.INTERSTITIAL 
  : "YOUR_PRODUCTION_INTERSTITIAL_ID_HERE"; // Production Interstitial ID - Replace with your AdMob ID

const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const InterstitialAdComponent = ({ clickCount, onAdClosed, adCouner }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
        setError(false);
      }
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        interstitialAd.load(); 
        onAdClosed(); 
      }
    );

    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.log('Interstitial ad error:', error);
        setError(true);
        setLoaded(false);
      }
    );

    interstitialAd.load(); 

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
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
