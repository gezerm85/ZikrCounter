import { Text, View, TextInput, Pressable, StyleSheet, Modal } from "react-native";
import React, { useState } from "react";
// Using built-in Modal instead of react-native-modal
import { useDispatch, useSelector } from "react-redux";
import { reset, setFavorite } from "../../redux/CounterSlice";
import moment from "moment";
import { getLocales } from "expo-localization";
import { useTranslation } from "react-i18next";

const CustomModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation();

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
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>{t("SAVE_LIST")}</Text>
          <TextInput
            placeholder={t("CHOOSE_NAME")}
            value={fav.fav}
            onChangeText={(text) => setFav({ ...fav, fav: text })}
            style={styles.input}
            placeholderTextColor={'#333333'}
          />

          <View style={styles.btnBox}>
            <Pressable onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>{t("CANCEL")}</Text>
            </Pressable>
            <Pressable onPress={handleOnPress} style={styles.button}>
              <Text style={styles.buttonText}>{t("SAVE")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

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
    fontSize: 18,
    fontFamily: "OpenSans",
    fontWeight: "900",
    color: '#000'
  },
  btnBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 16,
  },
  input: {
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    height: 48,
    color: '#333333'
  },
  button: {
   height: 48,
   paddingHorizontal: 24,
   alignItems: 'center',
   justifyContent: 'center',
  },
  buttonText:{
    fontSize: 16,
    fontFamily: "OpenSans",
    color: '#333333'
  },
});
