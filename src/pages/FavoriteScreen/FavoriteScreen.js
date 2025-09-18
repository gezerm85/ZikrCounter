import { FlatList, Text, View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import FavCard from "../../components/FavCard/FavCard";
import "moment/locale/tr";
import { fixedColors } from "../../utils/Theme/VectorTheme";
import InterstitialAd from "../../components/InterstitialAd/InterstitialAd";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner/AdBanner";
import CustomHeader from "../../components/CustomHeader/CustomHeader";

const FavoriteScreen = () => {
  const { t } = useTranslation();

  const { favorite } = useSelector((state) => state.counter);

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
      accessible={true}
      accessibilityLabel={t('TITLE')}
      style={[
        styles.container,
        { backgroundColor: fixedColors.bgColor },
      ]}
    >
      <CustomHeader 
        title={t("TITLE")} 
        subtitle={`${favorite.length} ${t("SAVED_DHIKR")}`} 
      />

      <View style={styles.bodyContainer}>
        {favorite.length == 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>{t("NO_DHIKR")}</Text>
            <Text style={styles.emptySubtitle}>{t("NO_DHIKR_DESC")}</Text>
          </View>
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
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

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "OpenSans",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "OpenSans",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 24,
  },
  bottomContainer: {
    width: "100%",
    height: "10%",
  },
});
