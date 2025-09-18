import { Text, View, TextInput, Pressable, StyleSheet, Modal } from "react-native";
import React, { useState, useEffect } from "react";
// Using built-in Modal instead of react-native-modal
import { useDispatch, useSelector } from "react-redux";
import {  updateFavorite } from "../../redux/CounterSlice";
import moment from "moment";
import { getLocales } from "expo-localization";
import { useTranslation } from "react-i18next";

const EditModal = ({ isVisible, onClose, selectedItem }) => {
  const { t } = useTranslation();

  const { value } = useSelector((e) => e.counter);

  const date = getLocales()[0].languageTag.split("-")[0].toString() || "tr";

  moment.locale(date);

  const now = moment().format("DD MMMM dddd");

  const [fav, setFav] = useState({
    id: selectedItem ? selectedItem.id : Math.floor(Math.random() * 9999999999),
    counter: selectedItem ? selectedItem.counter : value,
    fav: selectedItem ? selectedItem.fav : "",
    date: now,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedItem) {
      setFav({
        id: selectedItem.id,
        counter: selectedItem.counter,
        fav: selectedItem.fav,
        date: selectedItem.date,
      });
    }
  }, [selectedItem]);

  const handleOnPress = () => {
    if (value !== 0 || selectedItem) {
      if (selectedItem) {
        dispatch(updateFavorite(fav));
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>{t("EDIT")}</Text>
          <TextInput
            placeholder={t("CHOOSE_NAME")}
            value={fav.fav}
            onChangeText={(text) => setFav({ ...fav, fav: text })}
            style={styles.input}
          />

          <View style={styles.btnBox}>
            <Pressable onPress={onClose} style={styles.button}>
              <Text style={styles.btnText}>{t("CANCEL")}</Text>
            </Pressable>
            <Pressable onPress={handleOnPress} style={styles.button}>
              <Text style={styles.btnText}>{t("SAVE")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContainer: {
    backgroundColor: "#fff",
    padding: 16,
    gap: 16,
    borderRadius: 8,
    width: "90%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontFamily: "OpenSans",
    fontWeight: "900",
  },
  btnBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 16,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 4,
    fontSize: 18,
    fontFamily: "OpenSans",
  },
  button: {
    height: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 16,
    fontFamily: "OpenSans",
  },
});
