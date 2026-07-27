import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { View, Text, FlatList, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
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
  Pill,
  Chevron,
  StateView,
} from "../../components/explore/ExploreUI";
import {
  getHadithCategories,
  getHadithList,
  getHadithDetail,
  filterHadithItems,
} from "../../services/HadithService";
import { getHadithOfDay } from "../../services/dailyContentService";

const HadithListScreen = () => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  const navigation = useNavigation();
  const contentLanguage = useSelector((s) => s.contentPrefs.contentLanguage);
  const savedHadiths = useSelector((s) => s.savedContent.savedHadiths);

  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [status, setStatus] = useState("loading"); // loading | ready | error | offline
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState("");
  const [daily, setDaily] = useState(null);
  const loadingRef = useRef(false);

  const savedIds = useMemo(() => new Set(savedHadiths.map((h) => h.id)), [savedHadiths]);

  // Initial: categories + first usable category's first page + hadith of day.
  useEffect(() => {
    let active = true;
    (async () => {
      setStatus("loading");
      try {
        const cats = await getHadithCategories(contentLanguage);
        const usable = cats.filter((x) => (x.hadeethsCount || 0) > 0);
        const first = usable[0] || cats[0];
        if (!active) return;
        setCategories(usable.length ? usable : cats);
        setActiveCat(first || null);
        if (first) {
          const { items: it, pagination } = await getHadithList(contentLanguage, 1, 20, first.id);
          if (!active) return;
          setItems(it);
          setPage(pagination.currentPage || 1);
          setLastPage(pagination.lastPage || 1);
        }
        setStatus("ready");
      } catch (e) {
        if (active) setStatus(e?.isOffline ? "offline" : "error");
      }
    })();
    // hadith of day (best effort; hide on failure)
    (async () => {
      try {
        const h = await getHadithOfDay(contentLanguage);
        if (active) setDaily(h);
      } catch {
        if (active) setDaily(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [contentLanguage]);

  const selectCategory = useCallback(
    async (cat) => {
      if (loadingRef.current) return;
      setActiveCat(cat);
      setStatus("loading");
      setItems([]);
      try {
        const { items: it, pagination } = await getHadithList(contentLanguage, 1, 20, cat.id);
        setItems(it);
        setPage(pagination.currentPage || 1);
        setLastPage(pagination.lastPage || 1);
        setStatus("ready");
      } catch (e) {
        setStatus(e?.isOffline ? "offline" : "error");
      }
    },
    [contentLanguage]
  );

  // Pagination (protected against duplicate/overlapping loads).
  const loadMore = useCallback(async () => {
    if (loadingRef.current || query.trim() || !activeCat) return;
    if (page >= lastPage) return;
    loadingRef.current = true;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const { items: it, pagination } = await getHadithList(contentLanguage, next, 20, activeCat.id);
      setItems((prev) => [...prev, ...it]);
      setPage(pagination.currentPage || next);
      setLastPage(pagination.lastPage || lastPage);
    } catch {
      /* keep existing items; offline/next-page failure is non-blocking */
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }, [page, lastPage, activeCat, contentLanguage, query]);

  const visibleItems = useMemo(() => filterHadithItems(items, query), [items, query]);

  const openDetail = (id) =>
    navigation.navigate("MainStack", { screen: "HadithDetail", params: { id, categories } });

  const header = (
    <View>
      {/* Günün Hadisi */}
      {daily ? (
        <Card surface onPress={() => openDetail(daily.id)} style={{ padding: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Pill>{t("DAILY_HADITH")}</Pill>
            {(daily.source || daily.grade) ? (
              <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: c.muted }}>
                {[daily.source, daily.grade].filter(Boolean).join(" · ")}
              </Text>
            ) : null}
          </View>
          <Text numberOfLines={3} style={{ fontFamily: fonts.ui, fontSize: 14, color: c.inkSoft, lineHeight: 24, marginTop: 12 }}>
            {daily.translation || daily.title}
          </Text>
        </Card>
      ) : null}

      {/* Category chips */}
      {categories.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }} style={{ marginTop: daily ? 16 : 0 }}>
          {categories.slice(0, 20).map((cat) => {
            const on = activeCat?.id === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => selectCategory(cat)}
                style={{
                  backgroundColor: on ? c.gold : c.card,
                  borderWidth: 1,
                  borderColor: on ? c.gold : c.line,
                  borderRadius: 999,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                }}
              >
                <Text style={{ fontFamily: fonts.ui, fontSize: 13, fontWeight: "600", color: on ? c.onAcc : c.inkSoft }}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      <View style={{ marginTop: 16 }}>
        <SearchInput value={query} onChangeText={setQuery} placeholder={t("HADITH_SEARCH_PLACEHOLDER")} />
      </View>

      <View style={{ marginTop: 14 }}>
        <Card onPress={() => navigation.navigate("MainStack", { screen: "SavedHadiths" })} style={{ paddingVertical: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: c.goldSoft, alignItems: "center", justifyContent: "center" }}>
              <Feather name="bookmark" size={18} color={c.gold} />
            </View>
            <Text style={{ flex: 1, fontFamily: fonts.ui, fontSize: 15, fontWeight: "600", color: c.ink }}>{t("SAVED_HADITHS")}</Text>
            <Chevron />
          </View>
        </Card>
      </View>

      <SectionHeader>{t("HADITHS_SECTION")}</SectionHeader>
    </View>
  );

  const renderItem = ({ item }) => (
    <Card surface onPress={() => openDetail(item.id)} style={{ marginBottom: 12 }}>
      <Text style={{ fontFamily: fonts.ui, fontSize: 14, color: c.inkSoft, lineHeight: 23 }} numberOfLines={4}>
        {item.title}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
        {activeCat ? <Pill>{activeCat.name}</Pill> : null}
        <View style={{ flex: 1 }} />
        <Feather name="bookmark" size={16} color={savedIds.has(item.id) ? c.gold : c.muted} />
      </View>
    </Card>
  );

  return (
    <Screen>
      <ExploreHeader title={t("HADITHS")} subtitle={t("HADITH_HOME_SUBTITLE")} onBack={() => navigation.goBack()} />
      {status === "loading" && items.length === 0 ? (
        <View>
          {header}
          <StateView status="loading" />
        </View>
      ) : status === "error" || status === "offline" ? (
        <View>
          {header}
          <StateView status={status} message={status === "offline" ? t("ERR_NO_INTERNET") : t("ERR_HADITH_UNAVAILABLE")} onRetry={() => activeCat && selectCategory(activeCat)} />
        </View>
      ) : (
        <FlatList
          data={visibleItems}
          keyExtractor={(it) => it.id}
          ListHeaderComponent={header}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28, paddingTop: 8 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={c.gold} style={{ marginVertical: 16 }} />
            ) : visibleItems.length === 0 ? (
              <Text style={{ fontFamily: fonts.ui, fontSize: 14, color: c.muted, textAlign: "center", paddingVertical: 24 }}>
                {query.trim() ? t("NO_SEARCH_RESULT") : t("END_OF_LIST")}
              </Text>
            ) : page >= lastPage && !query.trim() ? (
              <Text style={{ fontFamily: fonts.ui, fontSize: 13, color: c.muted, textAlign: "center", paddingVertical: 18 }}>
                {t("END_OF_LIST")}
              </Text>
            ) : null
          }
        />
      )}
    </Screen>
  );
};

export default HadithListScreen;
