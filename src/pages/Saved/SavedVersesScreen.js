import React from "react";
import { View, Text, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import {
  ExploreScreen as Screen,
  ExploreHeader,
  Pill,
  SoftButton,
  OutlineButton,
  ArabicText,
  StateView,
} from "../../components/explore/ExploreUI";
import { getSurahMeta } from "../../data/surahMeta";
import { removeVerseThunk } from "../../redux/SavedContentSlice";

const SavedVersesScreen = () => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const savedVerses = useSelector((s) => s.savedContent.savedVerses);

  const open = (v) =>
    navigation.navigate("MainStack", { screen: "QuranReader", params: { surahNumber: v.surahNumber, focusAyah: v.ayahNumber } });

  const renderItem = ({ item }) => {
    const meta = getSurahMeta(item.surahNumber);
    const type = meta?.revelationType === "Medinan" ? t("MEDINAN") : t("MECCAN");
    const ref = `${item.surahName || meta?.turkishName || item.surahNumber} ${item.surahNumber}:${item.ayahNumber}`;
    return (
      <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 18, padding: 16, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontFamily: fonts.ui, fontSize: 14, fontWeight: "700", color: c.ink }}>{ref}</Text>
          <Pill>{type}</Pill>
        </View>
        {item.arabicText ? (
          <ArabicText size={20} color={c.ink} style={{ opacity: 0.75, marginTop: 12 }}>
            {item.arabicText}
          </ArabicText>
        ) : null}
        {item.translation ? (
          <Text style={{ fontFamily: fonts.ui, fontSize: 13, color: c.inkSoft, lineHeight: 22, marginTop: 8 }}>
            {item.translation}
          </Text>
        ) : null}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
          <SoftButton flex label={t("OPEN_IN_QURAN")} onPress={() => open(item)} />
          <OutlineButton icon="trash-2" label={t("REMOVE_ACTION")} onPress={() => dispatch(removeVerseThunk(item.id))} />
        </View>
      </View>
    );
  };

  return (
    <Screen>
      <ExploreHeader
        title={t("SAVED_VERSES")}
        subtitle={t("VERSE_COUNT", { count: savedVerses.length })}
        onBack={() => navigation.goBack()}
      />
      {savedVerses.length === 0 ? (
        <StateView status="empty" message={t("EMPTY_SAVED_VERSES")} />
      ) : (
        <FlatList
          data={savedVerses}
          keyExtractor={(v) => v.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
};

export default SavedVersesScreen;
