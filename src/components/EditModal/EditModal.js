import { Text, View, TextInput, Pressable, Vibration } from "react-native";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import {  updateFavorite } from "../../redux/CounterSlice";
import moment from "moment";
import styles from "./EditModal.style";
import { getLocales } from "expo-localization";
import { useTranslation } from "react-i18next";

const EditModal = ({ isVisible, onClose, selectedItem }) => {
  const { t } = useTranslation();

  const { value, vibrationEnabled } = useSelector((e) => e.counter);

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
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  return (
    <View style={styles.container}>
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
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
      </Modal>
    </View>
  );
};

export default EditModal;
