import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, Modal, Share } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import {
  ExploreScreen as Screen,
  ExploreHeader,
  HeaderIconButton,
  ArabicText,
  Toggle,
  StateView,
  OfflineBanner,
} from "../../components/explore/ExploreUI";
import { getSurah, resolveTranslationKey } from "../../services/QuranService";
import { getSurahMeta } from "../../data/surahMeta";
import { saveVerseThunk, removeVerseThunk, updateLastReadThunk } from "../../redux/SavedContentSlice";
import { incTextScale, decTextScale, setShowArabic, setShowTranslation } from "../../redux/ContentPrefsSlice";

const VerseBlock = ({ verse, surahName, showArabic, showTranslation, arSize, trSize, saved, onToggleSave, onShare }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <View
      style={{
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.line,
        borderRadius: 18,
        padding: 16,
        shadowColor: c.shadow,
        shadowOpacity: 1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: c.goldSoft, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: fonts.ui, fontSize: 13, fontWeight: "700", color: c.goldInk }}>{verse.ayahNumber}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Pressable onPress={onToggleSave} hitSlop={8}>
            <Feather name="bookmark" size={19} color={saved ? c.gold : c.muted} />
          </Pressable>
          <Pressable onPress={onShare} hitSlop={8}>
            <Feather name="share-2" size={18} color={c.muted} />
          </Pressable>
        </View>
      </View>
      {showArabic && verse.arabicText ? (
        <ArabicText size={arSize} color={c.ink} style={{ marginTop: 14, opacity: 0.85, lineHeight: arSize * 2 }}>
          {verse.arabicText}
        </ArabicText>
      ) : null}
      {showTranslation && verse.translation ? (
        <Text style={{ fontFamily: fonts.ui, fontSize: trSize, color: c.inkSoft, lineHeight: trSize * 1.7, marginTop: 10 }}>
          {verse.translation}
        </Text>
      ) : null}
    </View>
  );
};

const QuranReaderScreen = () => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const surahNumber = Number(route.params?.surahNumber) || 1;
  const focusAyah = route.params?.focusAyah ? Number(route.params.focusAyah) : null;

  const contentLanguage = useSelector((s) => s.contentPrefs.contentLanguage);
  const reading = useSelector((s) => s.contentPrefs.reading);
  const savedVerses = useSelector((s) => s.savedContent.savedVerses);
  const translationKey = resolveTranslationKey(contentLanguage);

  const meta = getSurahMeta(surahNumber);
  const [state, setState] = useState({ status: "loading", surah: null, fromCache: false });
  const [sheetOpen, setSheetOpen] = useState(false);
  const listRef = useRef(null);

  const load = useCallback(async () => {
    setState({ status: "loading", surah: null, fromCache: false });
    try {
      const { surah, fromCache } = await getSurah(surahNumber, translationKey);
      setState({ status: "ready", surah, fromCache });
    } catch (e) {
      setState({ status: e?.isOffline ? "offline" : "error", surah: null, fromCache: false });
    }
  }, [surahNumber, translationKey]);

  useEffect(() => {
    load();
  }, [load]);

  // Record last-read position (persisted, offline).
  useEffect(() => {
    if (state.status === "ready") {
      dispatch(
        updateLastReadThunk({
          surahNumber,
          ayahNumber: focusAyah || 1,
          surahName: meta?.turkishName || String(surahNumber),
          translationKey,
        })
      );
    }
  }, [state.status, surahNumber, focusAyah, translationKey, meta, dispatch]);

  const arSize = Math.round(27 * reading.textScale);
  const trSize = Math.round(15 * reading.textScale);
  const savedIds = useMemo(() => new Set(savedVerses.map((v) => v.id)), [savedVerses]);

  const onToggleSave = (verse) => {
    if (savedIds.has(verse.id)) {
      dispatch(removeVerseThunk(verse.id));
    } else {
      dispatch(saveVerseThunk({ ...verse, surahName: meta?.turkishName || String(surahNumber) }));
    }
  };

  const onShareVerse = (verse) => {
    const ref = `${meta?.turkishName || surahNumber} ${surahNumber}:${verse.ayahNumber}`;
    const body = [verse.arabicText, verse.translation, ref, "— QuranEnc.com"].filter(Boolean).join("\n\n");
    Share.share({ message: body }).catch(() => {});
  };

  const subtitle = `${t("SURAH")} ${surahNumber} · ${t("AYAH_COUNT", { count: meta?.ayahCount || state.surah?.verses?.length || 0 })}`;

  return (
    <Screen>
      <ExploreHeader
        title={meta?.turkishName || String(surahNumber)}
        subtitle={subtitle}
        onBack={() => navigation.goBack()}
        right={<AaButton onPress={() => setSheetOpen(true)} />}
      />
      <OfflineBanner visible={state.status === "ready" && state.fromCache} />

      {state.status === "loading" ? (
        <StateView status="loading" />
      ) : state.status === "error" || state.status === "offline" ? (
        <StateView
          status={state.status === "offline" ? "offline" : "error"}
          message={state.status === "offline" ? t("ERR_NO_INTERNET") : t("ERR_QURAN_UNAVAILABLE")}
          onRetry={load}
        />
      ) : (
        <FlatList
          ref={listRef}
          data={state.surah.verses}
          keyExtractor={(v) => v.id}
          contentContainerStyle={{ padding: 20, paddingTop: 16, gap: 14 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <VerseBlock
              verse={item}
              surahName={meta?.turkishName}
              showArabic={reading.showArabic}
              showTranslation={reading.showTranslation && !!item.translation}
              arSize={arSize}
              trSize={trSize}
              saved={savedIds.has(item.id)}
              onToggleSave={() => onToggleSave(item)}
              onShare={() => onShareVerse(item)}
            />
          )}
        />
      )}

      {/* Reading settings sheet */}
      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: c.overlay, justifyContent: "flex-end" }} onPress={() => setSheetOpen(false)}>
          <Pressable
            style={{ backgroundColor: c.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 28 }}
            onPress={() => {}}
          >
            <View style={{ width: 40, height: 5, borderRadius: 999, backgroundColor: c.line, alignSelf: "center", marginBottom: 14 }} />
            <Text style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: "700", color: c.ink, marginBottom: 6 }}>
              {t("READING_SETTINGS")}
            </Text>

            <SheetRow label={t("FONT_SIZE_LABEL")}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <ScaleButton label="A−" onPress={() => dispatch(decTextScale())} />
                <Text style={{ width: 44, textAlign: "center", fontFamily: fonts.ui, fontSize: 13, color: c.muted }}>
                  {Math.round(reading.textScale * 100)}%
                </Text>
                <ScaleButton label="A+" big onPress={() => dispatch(incTextScale())} />
              </View>
            </SheetRow>

            <SheetRow label={t("ARABIC_TEXT")} bordered>
              <Toggle value={reading.showArabic} onValueChange={(v) => dispatch(setShowArabic(v))} />
            </SheetRow>
            <SheetRow label={t("TRANSLATION_LABEL")} bordered>
              <Toggle value={reading.showTranslation} onValueChange={(v) => dispatch(setShowTranslation(v))} />
            </SheetRow>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
};

const AaButton = ({ onPress }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ width: 40, height: 40, borderRadius: 12, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.7 : 1 })}
    >
      <Text style={{ fontFamily: fonts.ui, fontSize: 15, fontWeight: "700", color: c.ink }}>Aa</Text>
    </Pressable>
  );
};

const ScaleButton = ({ label, onPress, big }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ width: 38, height: 38, borderRadius: 11, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.6 : 1 })}
    >
      <Text style={{ fontFamily: fonts.ui, fontSize: big ? 18 : 16, fontWeight: "700", color: c.ink }}>{label}</Text>
    </Pressable>
  );
};

const SheetRow = ({ label, children, bordered }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        borderTopWidth: bordered ? 1 : 0,
        borderTopColor: c.line,
      }}
    >
      <Text style={{ fontFamily: fonts.ui, fontSize: 14, fontWeight: "600", color: c.ink }}>{label}</Text>
      {children}
    </View>
  );
};

export default QuranReaderScreen;
