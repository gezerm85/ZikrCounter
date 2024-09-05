import { Pressable, View, Vibration, StatusBar, Image } from "react-native";
import React, { useState } from "react";
import ZikirCounter from "../../components/ZikirCounter/ZikirCounter";
import { useSelector, useDispatch } from "react-redux";
import * as Speech from "expo-speech";
import { changeGradientColor } from "../../redux/CounterSlice";
import SettingsModal from "../../components/SettingsModal/SettingsModal";
import { useNavigation } from "@react-navigation/native";
import { setTheme } from "../../utils/Theme/Theme";
import styles from "./HomeScreen.style";
import AdBanner from "../../components/AdBanner/AdBanner";
import InterstitialAd from "../../components/InterstitialAd/InterstitialAd";
import { img } from "../../utils/img/img";
import { useTranslation } from "react-i18next";

const HomeScreen = () => {
  const [isSettingsModal, setIsSettingsModal] = useState(false);
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

  const dispatch = useDispatch();

  const nav = useNavigation();

  const { value, vibrationEnabled, currentIndex } = useSelector(
    (state) => state.counter
  );

  const SettingsModalToggle = () => {
    setIsSettingsModal(!isSettingsModal);
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  const OnPress = () => {
    handleButtonClick("button1");
    setIsSettingsModal(!isSettingsModal);
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  const speakNumber = () => {
    handleButtonClick("button1");
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
    const numberText = value.toString();
    Speech.speak(numberText);
  };

  const handleChangeColor = () => {
    handleButtonClick("button");
    dispatch(changeGradientColor());
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  function handleNavigate() {
    handleButtonClick("button2");
    nav.navigate("FavoriteScreen");
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: setTheme[currentIndex].bgColor },
      ]}
      accessible={true}
      accessibilityLabel={"Home1"}
    >
      <StatusBar barStyle="default" />

      <View style={styles.btnContainer}>
        <Pressable
          accessible={true}
          accessibilityLabel={"SETTINGS1"}
          style={[
            styles.btnBox,
            { backgroundColor: setTheme[currentIndex].cardColor },
          ]}
          onPress={OnPress}
        >
          <Image style={styles.img} source={img.Settings} />
        </Pressable>
        <Pressable
          accessible={true}
          accessibilityLabel={"Theme"}
          style={[
            styles.btnBox,
            { backgroundColor: setTheme[currentIndex].cardColor },
          ]}
          onPress={handleChangeColor}
        >
          <Image style={styles.img} source={img.Paint} />
        </Pressable>
        <Pressable
          accessible={true}
          accessibilityLabel={t("COUNT")}
          style={[
            styles.btnBox,
            { backgroundColor: setTheme[currentIndex].cardColor },
          ]}
          onPress={speakNumber}
        >
          <Image style={styles.img} source={img.Sound} />
        </Pressable>
        <Pressable
          accessible={true}
          accessibilityLabel={t("TITLE")}
          style={[
            styles.btnBox,
            { backgroundColor: setTheme[currentIndex].cardColor },
          ]}
          onPress={handleNavigate}
        >
          <Image style={styles.img} source={img.Book} />
        </Pressable>
      </View>
      <View style={styles.bodyContainer}>
        <ZikirCounter onButtonClick={(value) => handleButtonClick(value)} />
      </View>
      <View style={styles.bottomContainer}>
        <AdBanner />
      </View>
      {isSettingsModal && (
        <View
          style={styles.modalOverlay}
          accessible={true}
          accessibilityLabel={"SETTINGS4"}
        >
          <SettingsModal
            isVisible={isSettingsModal}
            onClose={SettingsModalToggle}
          />
        </View>
      )}
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
