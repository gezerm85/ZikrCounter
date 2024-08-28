import { FlatList, Text, View } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import FavCard from "../../components/FavCard/FavCard";
import "moment/locale/tr";
import { setTheme } from "../../utils/Theme/Theme";
import styles from "./FavoriteScreen.style";
import InterstitialAd from "../../components/InterstitialAd/InterstitialAd";
import { useTranslation } from "react-i18next";

const FavoriteScreen = () => {
  const { t } = useTranslation();

  const { favorite, currentIndex } = useSelector((state) => state.counter);

  const [clickCounts, setClickCounts] = useState({
    button1: 0,
    button2: 0,
    button3: 0,
    button4: 0,
  });

  const thresholds = {
    button1: 5,
    button2: 10,
    button3: 20,
    button4: 30,
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
      style={[
        styles.container,
        { backgroundColor: setTheme[currentIndex].bgColor },
      ]}
    >
      {favorite.length == 0 ? (
        <Text style={styles.title}>{t("NO_DHIKR")}</Text>
      ) : (
        <FlatList
          data={favorite}
          renderItem={({ item }) => (
            <FavCard
              item={item}
              handleButtonClick={(value) => handleButtonClick(value)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
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

export default FavoriteScreen;
