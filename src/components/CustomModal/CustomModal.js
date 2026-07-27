import { Text, View, TextInput, Pressable, StyleSheet, Modal } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reset, setFavorite } from "../../redux/CounterSlice";
import moment from "moment";
import { getLocales } from "expo-localization";
import { useTranslation } from "react-i18next";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";

const CustomModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  const { value } = useSelector((e) => e.counter);

  const date = getLocales()[0].languageTag.split("-")[0].toString() || "tr";
  moment.locale(date);
  const now = moment().format("DD MMMM dddd");

  const [fav, setFav] = useState({
    id: Math.floor(Math.random() * 9999999999),
    counter: value,
    fav: "",
    date: now,
  });

  const dispatch = useDispatch();

  const handleOnPress = () => {
    if (value !== 0 && fav.fav.length !== 0) {
      dispatch(setFavorite(fav));
      setFav({ id: Math.floor(Math.random() * 9999999999), counter: value, fav: "" });
      dispatch(reset());
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: c.overlay }]}>
        <View style={[styles.body, { backgroundColor: c.surface, borderColor: c.line }]}>
          <Text style={[styles.title, { color: c.ink, fontFamily: fonts.display }]}>{t("SAVE_LIST")}</Text>
          <TextInput
            placeholder={t("CHOOSE_NAME")}
            value={fav.fav}
            onChangeText={(text) => setFav({ ...fav, fav: text })}
            style={[styles.input, { color: c.ink, borderColor: c.line, fontFamily: fonts.ui }]}
            placeholderTextColor={c.muted}
          />
          <View style={styles.btnBox}>
            <Pressable onPress={onClose} style={[styles.ghostBtn, { borderColor: c.line }]}>
              <Text style={{ color: c.inkSoft, fontFamily: fonts.ui, fontSize: 14, fontWeight: "600" }}>{t("CANCEL")}</Text>
            </Pressable>
            <Pressable onPress={handleOnPress} style={[styles.primaryBtn, { backgroundColor: c.gold }]}>
              <Text style={{ color: c.onAcc, fontFamily: fonts.ui, fontSize: 14, fontWeight: "700" }}>{t("SAVE")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  body: { padding: 20, gap: 18, borderRadius: 20, borderWidth: 1, width: "100%", maxWidth: 400 },
  title: { fontSize: 20, fontWeight: "700" },
  input: { height: 48, borderBottomWidth: 1, paddingHorizontal: 4, fontSize: 16 },
  btnBox: { flexDirection: "row", alignSelf: "flex-end", gap: 12 },
  ghostBtn: { height: 44, paddingHorizontal: 20, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1 },
  primaryBtn: { height: 44, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", borderRadius: 12 },
});
