import { Text, View, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { reset, setFavorite } from "../../redux/CounterSlice";
import moment from "moment";
import styles from "./CustomModal.style";
import { getLocales } from "expo-localization";
import { useTranslation } from "react-i18next";

const CustomModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation();

  const { value, currentIndex } = useSelector((e) => e.counter);

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
    if (value !== 0) {
      dispatch(setFavorite(fav));
      setFav({
        id: Math.floor(Math.random() * 9999999999),
        counter: value,
        fav: "",
      });
      dispatch(reset());
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>{t("SAVE_LIST")}</Text>
          <TextInput
            placeholder={t("CHOOSE_NAME")}
            value={fav.fav}
            onChangeText={(text) => setFav({ ...fav, fav: text })}
            style={styles.input}
          />

          <View style={styles.btnBox}>
            <Pressable onPress={onClose} style={styles.button}>
              <Text>{t("CANCEL")}</Text>
            </Pressable>
            <Pressable onPress={handleOnPress} style={styles.button}>
              <Text>{t("SAVE")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomModal;
