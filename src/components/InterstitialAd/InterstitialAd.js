import  { useState, useEffect } from "react";
import {
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";

const adUnitId = "ca-app-pub-9856483340336068/4545016838";

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
        interstitialAd.load(); 
        onAdClosed(); 
      }
    );

    interstitialAd.load(); 

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
