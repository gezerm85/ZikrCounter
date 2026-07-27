import { FlatList, Text, View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import FavCard from "../../components/FavCard/FavCard";
import "moment/locale/tr";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import InterstitialAd from "../../components/InterstitialAd/InterstitialAd";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner/AdBanner";
import CustomHeader from "../../components/CustomHeader/CustomHeader";

const FavoriteScreen = () => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();

  const { favorite } = useSelector((state) => state.counter);

  const [clickCounts, setClickCounts] = useState({
    button1: 0,
    button2: 0,
    button3: 0,
    button4: 0,
  });

  const thresholds = { button1: 5, button2: 10, button3: 20, button4: 30 };

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
      accessibilityLabel={t("TITLE")}
      style={[styles.container, { backgroundColor: c.bg }]}
    >
      <CustomHeader title={t("TITLE")} subtitle={`${favorite.length} ${t("SAVED_DHIKR")}`} />

      <View style={styles.bodyContainer}>
        {favorite.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="bookmark" size={44} color={c.muted} />
            <Text style={[styles.emptyTitle, { color: c.ink, fontFamily: fonts.display }]}>{t("NO_DHIKR")}</Text>
            <Text style={[styles.emptySubtitle, { color: c.muted, fontFamily: fonts.ui }]}>{t("NO_DHIKR_DESC")}</Text>
          </View>
        ) : (
          <FlatList
            data={favorite}
            renderItem={({ item }) => (
              <FavCard item={item} handleButtonClick={(value) => handleButtonClick(value)} />
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
  container: { flex: 1, position: "relative" },
  bodyContainer: { flex: 1, paddingHorizontal: 20 },
  listContainer: { paddingVertical: 12 },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  emptyTitle: { fontSize: 22, fontWeight: "700", textAlign: "center", marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, fontWeight: "400", textAlign: "center", lineHeight: 22 },
  bottomContainer: { width: "100%", height: 80 },
});
