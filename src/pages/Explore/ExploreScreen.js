import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import { toggleExploreTheme } from "../../redux/ContentPrefsSlice";
import {
  ExploreScreen as Screen,
  ExploreHeader,
  HeaderIconButton,
  Card,
  IconChip,
  Pill,
  SoftButton,
  Chevron,
  ArabicText,
} from "../../components/explore/ExploreUI";
import { getVerseOfDay } from "../../services/dailyContentService";
import { getSurahMeta } from "../../data/surahMeta";

const goStack = (navigation, screen, params) =>
  navigation.navigate("MainStack", { screen, params });

const FeatureCard = ({ icon, title, subtitle, onPress }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <Card onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <IconChip name={icon} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.ui, fontSize: 17, fontWeight: "700", color: c.ink }}>{title}</Text>
          <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: c.muted, marginTop: 2 }}>{subtitle}</Text>
        </View>
        <Chevron />
      </View>
    </Card>
  );
};

const ExploreScreen = () => {
  const { t } = useTranslation();
  const { c, fonts, mode } = useExploreTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const contentLanguage = useSelector((s) => s.contentPrefs.contentLanguage);

  const [daily, setDaily] = useState({ status: "loading", verse: null, ref: null });

  const loadDaily = useCallback(async () => {
    setDaily((d) => ({ ...d, status: "loading" }));
    try {
      const { verse, ref } = await getVerseOfDay(contentLanguage, 0);
      setDaily({ status: "ready", verse, ref });
    } catch {
      setDaily({ status: "error", verse: null, ref: null });
    }
  }, [contentLanguage]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { verse, ref } = await getVerseOfDay(contentLanguage, 0);
        if (active) setDaily({ status: "ready", verse, ref });
      } catch {
        if (active) setDaily({ status: "error", verse: null, ref: null });
      }
    })();
    return () => {
      active = false;
    };
  }, [contentLanguage]);

  const dailyRefLabel = daily.ref
    ? `${getSurahMeta(daily.ref.surahNumber)?.turkishName || daily.ref.surahNumber} · ${daily.ref.surahNumber}:${daily.ref.ayahNumber}`
    : "";

  return (
    <Screen>
      <ExploreHeader
        title={t("EXPLORE")}
        subtitle={t("EXPLORE_SUBTITLE")}
        right={
          <HeaderIconButton
            name={mode === "dark" ? "sun" : "moon"}
            onPress={() => dispatch(toggleExploreTheme())}
            accent
          />
        }
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 6, gap: 14 }} showsVerticalScrollIndicator={false}>
        <FeatureCard
          icon="book-open"
          title={t("QURAN")}
          subtitle={t("QURAN_SUBTITLE")}
          onPress={() => goStack(navigation, "QuranSurahList")}
        />
        <FeatureCard
          icon="book"
          title={t("HADITHS")}
          subtitle={t("HADITHS_SUBTITLE")}
          onPress={() => goStack(navigation, "HadithList")}
        />

        {/* Günün Ayeti */}
        <Card surface>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Pill>{t("DAILY_VERSE")}</Pill>
            {dailyRefLabel ? (
              <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: c.muted }}>{dailyRefLabel}</Text>
            ) : null}
          </View>
          {daily.status === "ready" && daily.verse ? (
            <>
              <ArabicText size={22} color={c.ink} style={{ marginTop: 12, opacity: 0.85 }}>
                {daily.verse.arabicText}
              </ArabicText>
              {daily.verse.translation ? (
                <Text style={{ fontFamily: fonts.ui, fontSize: 14, color: c.inkSoft, lineHeight: 22, marginTop: 10 }}>
                  {daily.verse.translation}
                </Text>
              ) : null}
              <Pressable_OpenVerse
                onPress={() =>
                  goStack(navigation, "QuranReader", {
                    surahNumber: daily.ref.surahNumber,
                    focusAyah: daily.ref.ayahNumber,
                  })
                }
              />
            </>
          ) : daily.status === "error" ? (
            <Text style={{ fontFamily: fonts.ui, fontSize: 13, color: c.muted, marginTop: 12 }}>
              {t("ERR_QURAN_UNAVAILABLE")}
            </Text>
          ) : (
            <Text style={{ fontFamily: fonts.ui, fontSize: 13, color: c.muted, marginTop: 12 }}>{t("LOADING")}</Text>
          )}
        </Card>

        {/* Shortcuts */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <ShortcutButton icon="bookmark" label={t("SAVED_VERSES")} onPress={() => goStack(navigation, "SavedVerses")} />
          </View>
          <View style={{ flex: 1 }}>
            <ShortcutButton icon="bookmark" label={t("SAVED_HADITHS")} onPress={() => goStack(navigation, "SavedHadiths")} />
          </View>
        </View>

        {/* Sources link */}
        <SoftButton label={t("SOURCES")} icon="info" onPress={() => goStack(navigation, "Sources")} />
      </ScrollView>
    </Screen>
  );
};

// Small "open in Qur'an" link under the daily verse.
const Pressable_OpenVerse = ({ onPress }) => {
  const { c, fonts } = useExploreTheme();
  const { t } = useTranslation();
  return (
    <Text
      onPress={onPress}
      style={{ fontFamily: fonts.ui, fontSize: 13, fontWeight: "700", color: c.gold, marginTop: 12 }}
    >
      {t("OPEN_IN_QURAN")} ›
    </Text>
  );
};

const ShortcutButton = ({ icon, label, onPress }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <Card onPress={onPress} style={{ flex: 1, alignItems: "center", paddingVertical: 14 }}>
      <View style={{ alignItems: "center", gap: 6 }}>
        <Feather name={icon} size={22} color={c.gold} />
        <Text style={{ fontFamily: fonts.ui, fontSize: 12, fontWeight: "600", color: c.ink }}>{label}</Text>
      </View>
    </Card>
  );
};

export default ExploreScreen;
