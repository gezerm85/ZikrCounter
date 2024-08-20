import { Text, View, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { reset, setFavorite } from "../../redux/CounterSlice";
import moment from "moment";
import styles from "./CustomModal.style";

const CustomModal = ({ isVisible, onClose }) => {
  const { value, currentIndex } = useSelector((e) => e.counter);

  moment.locale("tr");

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
          <Text style={styles.title}>Listeye Kaydet</Text>
          <TextInput
            placeholder="Lütfen bir isim belirleyin"
            value={fav.fav}
            onChangeText={(text) => setFav({ ...fav, fav: text })}
            style={styles.input}
          />

          <View style={styles.btnBox}>
            <Pressable onPress={onClose} style={styles.button}>
              <Text>VAZGEÇ</Text>
            </Pressable>
            <Pressable onPress={handleOnPress} style={styles.button}>
              <Text>KAYDET</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomModal;
