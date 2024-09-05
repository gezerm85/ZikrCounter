import { Text, TouchableOpacity, View, Image, Vibration } from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../../redux/CounterSlice";
import { setTheme } from "../../utils/Theme/Theme";
import styles from "./FavCard.style";
import { img } from "../../utils/img/img";
import { Menu } from "react-native-paper";
import EditModal from "../EditModal/EditModal";
import { useTranslation } from "react-i18next";

const FavCard = ({ item, handleButtonClick }) => {
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const { currentIndex, vibrationEnabled } = useSelector(
    (state) => state.counter
  );

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const handleOnEditPress = () => {
    setModalVisible(true);
    setVisible(false);
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  const openMenu = () => {
    setVisible(true);
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  const closeMenu = () => {
    setVisible(false);
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  const handleOnPress = (value) => {
    handleButtonClick(value);
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  const removeOnPress = () => {
    handleOnPress("button1");
    dispatch(removeFavorite(item.id));
  };
  return (
    <View
      accessible={true}
      accessibilityLabel={"Card"}
      style={styles.container}
    >
      <View
        style={[
          styles.box,
          { backgroundColor: setTheme[currentIndex].cardColor },
        ]}
      >
        <View style={styles.bodyContainer}>
          <View>
            <Text style={styles.textFav}>{item.fav}</Text>
            <Text style={styles.textDate}>{item.date}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.counter,
            { backgroundColor: setTheme[currentIndex].bgColor },
          ]}
        >
          {item.counter}
        </Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={"edit"}
              onPress={openMenu}
              style={styles.menuBox}
            >
              <Image style={styles.menu} source={img.menu} />
            </TouchableOpacity>
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item
            style={styles.menuItem}
            leadingIcon={() => (
              <MaterialIcons name="mode-edit" size={24} color="black" />
            )}
            onPress={handleOnEditPress}
            title={t("EDIT")}
          />
          <Menu.Item
            style={styles.menuItem}
            leadingIcon={() => (
              <MaterialIcons name="delete" size={24} color="#1a1a1a" />
            )}
            onPress={removeOnPress}
            title={t("REMOVE")}
          />
        </Menu>
      </View>
      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <EditModal
            isVisible={isModalVisible}
            onClose={toggleModal}
            selectedItem={item}
          />
        </View>
      )}
    </View>
  );
};

export default FavCard;
