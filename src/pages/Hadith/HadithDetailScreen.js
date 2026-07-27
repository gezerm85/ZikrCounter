import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Share } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import {
  ExploreScreen as Screen,
  ExploreHeader,
  HeaderIconButton,
  Pill,
  PrimaryButton,
  OutlineButton,
  ArabicText,
  StateView,
  OfflineBanner,
} from "../../components/explore/ExploreUI";
import { getHadithDetail } from "../../services/HadithService";
import { saveHadithThunk, removeHadithThunk } from "../../redux/SavedContentSlice";

const LabeledBlock = ({ label, children }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 18, padding: 16 }}>
      <Text style={{ fontFamily: fonts.ui, fontSize: 12, fontWeight: "700", color: c.muted, letterSpacing: 0.5, marginBottom: 8 }}>
        {label}
      </Text>
      {children}
    </View>
  );
};

const HadithDetailScreen = () => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const id = String(route.params?.id);
  const categoryLookup = route.params?.categories;
  const contentLanguage = useSelector((s) => s.contentPrefs.contentLanguage);
  const savedHadiths = useSelector((s) => s.savedContent.savedHadiths);
  const isSaved = savedHadiths.some((h) => h.id === id);

  const [state, setState] = useState({ status: "loading", hadith: null, fromCache: false });

  const load = useCallback(async () => {
    setState({ status: "loading", hadith: null, fromCache: false });
    try {
      const { hadith, fromCache } = await getHadithDetail(id, contentLanguage, { categoryLookup });
      setState({ status: "ready", hadith, fromCache });
    } catch (e) {
      setState({ status: e?.isOffline ? "offline" : "error", hadith: null, fromCache: false });
    }
  }, [id, contentLanguage, categoryLookup]);

  useEffect(() => {
    load();
  }, [load]);

  const h = state.hadith;

  const toggleSave = () => {
    if (!h) return;
    if (isSaved) dispatch(removeHadithThunk(h.id));
    else dispatch(saveHadithThunk(h));
  };

  const onShare = () => {
    if (!h) return;
    const body = [h.arabicText, h.translation, h.source && `${t("SOURCE_LABEL")}: ${h.source}`, "— HadeethEnc.com"]
      .filter(Boolean)
      .join("\n\n");
    Share.share({ message: body }).catch(() => {});
  };

  return (
    <Screen>
      <ExploreHeader
        title={t("HADITH_DETAIL_TITLE")}
        subtitle={h?.source || undefined}
        onBack={() => navigation.goBack()}
        right={
          <HeaderIconButton name="bookmark" accent={!isSaved} color={isSaved ? c.gold : undefined} onPress={toggleSave} />
        }
      />
      <OfflineBanner visible={state.status === "ready" && state.fromCache} />

      {state.status === "loading" ? (
        <StateView status="loading" />
      ) : state.status === "error" || state.status === "offline" ? (
        <StateView
          status={state.status}
          message={state.status === "offline" ? t("ERR_NO_INTERNET") : t("ERR_HADITH_UNAVAILABLE")}
          onRetry={load}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 12, gap: 14 }} showsVerticalScrollIndicator={false}>
          {/* meta chips */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            {h.categories?.filter((cat) => cat.name).map((cat) => (
              <Pill key={cat.id}>{cat.name}</Pill>
            ))}
            {h.grade ? <Pill tone="outline">{`${t("GRADE_LABEL")}: ${h.grade}`}</Pill> : null}
            {h.source ? (
              <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: c.muted }}>{`${t("SOURCE_LABEL")}: ${h.source}`}</Text>
            ) : null}
          </View>

          {/* Arabic */}
          {h.arabicText ? (
            <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 18, padding: 18 }}>
              <ArabicText size={24} color={c.ink} style={{ opacity: 0.85, lineHeight: 48 }}>
                {h.arabicText}
              </ArabicText>
            </View>
          ) : null}

          {/* Meâl */}
          {h.translation ? (
            <LabeledBlock label={t("MEAL")}>
              <Text style={{ fontFamily: fonts.ui, fontSize: 15, color: c.inkSoft, lineHeight: 26 }}>{h.translation}</Text>
            </LabeledBlock>
          ) : null}

          {/* Açıklama — only when provided */}
          {h.explanation ? (
            <LabeledBlock label={t("EXPLANATION")}>
              <Text style={{ fontFamily: fonts.ui, fontSize: 15, color: c.inkSoft, lineHeight: 26 }}>{h.explanation}</Text>
            </LabeledBlock>
          ) : null}

          {/* Faydalar / benefits — only when provided */}
          {h.benefits && h.benefits.length ? (
            <LabeledBlock label={t("BENEFITS")}>
              {h.benefits.map((b, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, marginTop: i === 0 ? 0 : 8 }}>
                  <Text style={{ color: c.gold, fontSize: 15, lineHeight: 26 }}>•</Text>
                  <Text style={{ flex: 1, fontFamily: fonts.ui, fontSize: 15, color: c.inkSoft, lineHeight: 26 }}>{b}</Text>
                </View>
              ))}
            </LabeledBlock>
          ) : null}

          {/* actions */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
            <PrimaryButton
              flex
              icon="bookmark"
              label={isSaved ? t("SAVED_LABEL") : t("SAVE_ACTION")}
              onPress={toggleSave}
            />
            <OutlineButton icon="share-2" onPress={onShare} />
          </View>
        </ScrollView>
      )}
    </Screen>
  );
};

export default HadithDetailScreen;
