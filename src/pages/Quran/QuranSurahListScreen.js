import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import {
  ExploreScreen as Screen,
  ExploreHeader,
  Card,
  SearchInput,
  SectionHeader,
  Chevron,
  ArabicText,
} from "../../components/explore/ExploreUI";
import { getSurahList } from "../../services/QuranService";

const normalize = (s) =>
  (s || "")
    .toLocaleLowerCase("tr")
    .replace(/[îıi̇]/g, "i")
    .replace(/[âa]/g, "a")
    .replace(/[û]/g, "u");

const SurahRow = ({ item, onPress, isLast }) => {
  const { c, fonts } = useExploreTheme();
  const { t } = useTranslation();
  const type = item.revelationType === "Medinan" ? t("MEDINAN") : t("MECCAN");
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: c.line,
        backgroundColor: pressed ? c.goldSoft : "transparent",
      })}
    >
      <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: c.goldSoft, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontFamily: fonts.ui, fontSize: 14, fontWeight: "700", color: c.goldInk }}>{item.number}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
          <Text style={{ fontFamily: fonts.ui, fontSize: 15, fontWeight: "600", color: c.ink }}>{item.turkishName}</Text>
          <ArabicText size={19} color={c.gold} style={{ opacity: 1, lineHeight: 26 }}>
            {item.arabicName}
          </ArabicText>
        </View>
        <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: c.muted, marginTop: 2 }}>
          {t("AYAH_COUNT", { count: item.ayahCount })} · {type}
        </Text>
      </View>
    </Pressable>
  );
};

const QuranSurahListScreen = () => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  const navigation = useNavigation();
  const lastRead = useSelector((s) => s.savedContent.lastRead);
  const [query, setQuery] = useState("");

  const surahs = getSurahList();
  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        normalize(s.turkishName).includes(q) ||
        String(s.number) === query.trim() ||
        (s.arabicName || "").includes(query.trim())
    );
  }, [query, surahs]);

  const openSurah = (surahNumber, focusAyah) =>
    navigation.navigate("MainStack", { screen: "QuranReader", params: { surahNumber, focusAyah } });

  const header = (
    <View>
      {lastRead ? (
        <Pressable
          onPress={() => openSurah(lastRead.surahNumber, lastRead.ayahNumber)}
          style={({ pressed }) => ({
            backgroundColor: c.gold,
            borderRadius: 18,
            paddingVertical: 16,
            paddingHorizontal: 18,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{ fontFamily: fonts.ui, fontSize: 12, fontWeight: "600", letterSpacing: 0.5, color: c.onAcc, opacity: 0.85 }}>
            {t("CONTINUE_READING")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: 6 }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: "700", color: c.onAcc }}>
              {lastRead.surahName}
            </Text>
            <Text style={{ fontFamily: fonts.ui, fontSize: 13, fontWeight: "600", color: c.onAcc }}>
              {t("AYAH_PROGRESS", { current: lastRead.ayahNumber, total: surahs.find((s) => s.number === lastRead.surahNumber)?.ayahCount || "" })}
            </Text>
          </View>
        </Pressable>
      ) : null}

      <View style={{ marginTop: lastRead ? 14 : 0 }}>
        <SearchInput value={query} onChangeText={setQuery} placeholder={t("SURAH_SEARCH_PLACEHOLDER")} />
      </View>

      <View style={{ marginTop: 14 }}>
        <Card onPress={() => navigation.navigate("MainStack", { screen: "SavedVerses" })} style={{ paddingVertical: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: c.goldSoft, alignItems: "center", justifyContent: "center" }}>
              <Feather name="bookmark" size={18} color={c.gold} />
            </View>
            <Text style={{ flex: 1, fontFamily: fonts.ui, fontSize: 15, fontWeight: "600", color: c.ink }}>{t("SAVED_VERSES")}</Text>
            <Chevron />
          </View>
        </Card>
      </View>

      <SectionHeader>{t("SURAHS_SECTION")}</SectionHeader>
    </View>
  );

  return (
    <Screen>
      <ExploreHeader title={t("QURAN")} subtitle={t("SURAH_LIST")} onBack={() => navigation.goBack()} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.number)}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28, paddingTop: 8 }}
        renderItem={({ item, index }) => (
          <View style={index === 0 ? { backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderTopLeftRadius: 18, borderTopRightRadius: 18, overflow: "hidden" } : { backgroundColor: c.surface, borderColor: c.line, borderLeftWidth: 1, borderRightWidth: 1 }}>
            <SurahRow item={item} isLast={false} onPress={() => openSurah(item.number)} />
          </View>
        )}
        ListFooterComponent={
          filtered.length ? (
            <View style={{ height: 18, backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderTopWidth: 0, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }} />
          ) : (
            <Text style={{ fontFamily: fonts.ui, fontSize: 14, color: c.muted, textAlign: "center", paddingVertical: 30 }}>
              {t("NO_SEARCH_RESULT")}
            </Text>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};

export default QuranSurahListScreen;
