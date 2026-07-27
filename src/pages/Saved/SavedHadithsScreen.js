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
  StateView,
} from "../../components/explore/ExploreUI";
import { removeHadithThunk } from "../../redux/SavedContentSlice";

const SavedHadithsScreen = () => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const savedHadiths = useSelector((s) => s.savedContent.savedHadiths);

  const open = (h) =>
    navigation.navigate("MainStack", { screen: "HadithDetail", params: { id: h.id } });

  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 18, padding: 16, marginBottom: 12 }}>
      <Text numberOfLines={4} style={{ fontFamily: fonts.ui, fontSize: 14, color: c.inkSoft, lineHeight: 23 }}>
        {item.translation || item.title}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 12 }}>
        {item.categories?.filter((cat) => cat.name).slice(0, 1).map((cat) => (
          <Pill key={cat.id}>{cat.name}</Pill>
        ))}
        {item.grade ? <Pill tone="outline">{item.grade}</Pill> : null}
        {item.source ? <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: c.muted }}>{item.source}</Text> : null}
      </View>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
        <SoftButton flex label={t("OPEN_DETAIL")} onPress={() => open(item)} />
        <OutlineButton icon="trash-2" label={t("REMOVE_ACTION")} onPress={() => dispatch(removeHadithThunk(item.id))} />
      </View>
    </View>
  );

  return (
    <Screen>
      <ExploreHeader
        title={t("SAVED_HADITHS")}
        subtitle={t("HADITH_COUNT_LABEL", { count: savedHadiths.length })}
        onBack={() => navigation.goBack()}
      />
      {savedHadiths.length === 0 ? (
        <StateView status="empty" message={t("EMPTY_SAVED_HADITHS")} />
      ) : (
        <FlatList
          data={savedHadiths}
          keyExtractor={(h) => h.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
};

export default SavedHadithsScreen;
