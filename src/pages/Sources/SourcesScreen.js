import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import {
  ExploreScreen as Screen,
  ExploreHeader,
  Card,
  IconChip,
  SectionHeader,
} from "../../components/explore/ExploreUI";
import { ATTRIBUTION, SUPPORTED_CONTENT_LANGUAGES } from "../../config/religiousContent";
import { setContentLanguage, setExploreTheme } from "../../redux/ContentPrefsSlice";
import { getQuranTranslations, getQuranSyncVersion, resolveTranslationKey } from "../../services/QuranService";

const Segmented = ({ options, value, onChange }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <View style={{ flexDirection: "row", gap: 8, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 16, padding: 6 }}>
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{ flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, backgroundColor: on ? c.gold : "transparent" }}
          >
            <Text style={{ fontFamily: fonts.ui, fontSize: 14, fontWeight: "600", color: on ? c.onAcc : c.inkSoft }}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const InfoRow = ({ label, value }) => {
  const { c, fonts } = useExploreTheme();
  if (!value) return null;
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
      <Text style={{ fontFamily: fonts.ui, fontSize: 13, color: c.muted }}>{label}</Text>
      <Text style={{ fontFamily: fonts.ui, fontSize: 13, fontWeight: "600", color: c.ink, flexShrink: 1, textAlign: "right", marginLeft: 12 }}>{value}</Text>
    </View>
  );
};

const SourcesScreen = () => {
  const { t } = useTranslation();
  const { c, fonts, mode } = useExploreTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const contentLanguage = useSelector((s) => s.contentPrefs.contentLanguage);

  const [trInfo, setTrInfo] = useState(null);
  const [sync, setSync] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const key = resolveTranslationKey(contentLanguage);
      try {
        const [list, syncInfo] = await Promise.all([
          getQuranTranslations(),
          getQuranSyncVersion(key),
        ]);
        if (!active) return;
        setTrInfo(list.find((x) => x.key === key) || null);
        setSync(syncInfo);
      } catch {
        /* attribution still shown without live version details */
      }
    })();
    return () => {
      active = false;
    };
  }, [contentLanguage]);

  const langLabel = { tr: t("LANG_TR"), en: t("LANG_EN"), ar: t("LANG_AR") };
  const lastSync = sync?.lastSyncAt ? new Date(sync.lastSyncAt).toLocaleDateString() : undefined;

  return (
    <Screen>
      <ExploreHeader title={t("SOURCES")} subtitle={t("SOURCES_SUBTITLE")} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <SectionHeader style={{ marginTop: 0 }}>{t("CONTENT_LANGUAGE")}</SectionHeader>
        <Segmented
          value={contentLanguage}
          onChange={(v) => dispatch(setContentLanguage(v))}
          options={SUPPORTED_CONTENT_LANGUAGES.map((l) => ({ value: l, label: langLabel[l] }))}
        />

        <SectionHeader>{t("THEME")}</SectionHeader>
        <Segmented
          value={mode}
          onChange={(v) => dispatch(setExploreTheme(v))}
          options={[
            { value: "light", label: t("THEME_LIGHT") },
            { value: "dark", label: t("THEME_DARK") },
          ]}
        />

        <SectionHeader>{t("SOURCES")}</SectionHeader>

        {/* Quran source */}
        <Card surface style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <IconChip name="book-open" size={44} icon={22} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.ui, fontSize: 14, color: c.inkSoft, lineHeight: 22 }}>{t("QURAN_SOURCE_DESC")}</Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
          <InfoRow label={t("TRANSLATION_NAME_LABEL")} value={trInfo?.title} />
          <InfoRow label={t("TRANSLATION_LANGUAGE_LABEL")} value={trInfo ? langLabel[trInfo.language] : undefined} />
          <InfoRow label={t("TRANSLATION_VERSION_LABEL")} value={sync?.remoteVersion || trInfo?.version} />
          <InfoRow label={t("LAST_SYNC_LABEL")} value={lastSync} />
          <Pressable onPress={() => Linking.openURL(ATTRIBUTION.quran.url)} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 }}>
            <Feather name="external-link" size={15} color={c.gold} />
            <Text style={{ fontFamily: fonts.ui, fontSize: 13, fontWeight: "700", color: c.gold }}>{ATTRIBUTION.quran.source}</Text>
          </Pressable>
        </Card>

        {/* Hadith source */}
        <Card surface>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <IconChip name="book" size={44} icon={22} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.ui, fontSize: 14, color: c.inkSoft, lineHeight: 22 }}>{t("HADITH_SOURCE_DESC")}</Text>
            </View>
          </View>
          <Pressable onPress={() => Linking.openURL(ATTRIBUTION.hadith.url)} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 }}>
            <Feather name="external-link" size={15} color={c.gold} />
            <Text style={{ fontFamily: fonts.ui, fontSize: 13, fontWeight: "700", color: c.gold }}>{ATTRIBUTION.hadith.source}</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </Screen>
  );
};

export default SourcesScreen;
