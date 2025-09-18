import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../../redux/CounterSlice";
import { fixedColors } from "../../utils/Theme/VectorTheme";
import { img } from "../../utils/img/img";
import { Menu } from "react-native-paper";
import EditModal from "../EditModal/EditModal";
import { useTranslation } from "react-i18next";

const FavCard = ({ item, handleButtonClick }) => {
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // currentIndex artık sadece vector için kullanılıyor

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const handleOnEditPress = () => {
    setModalVisible(true);
    setVisible(false);
  };
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  const handleOnPress = (value) => {
    handleButtonClick(value);
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
          { backgroundColor: fixedColors.cardColor },
        ]}
      >
        <View style={styles.bodyContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textFav}>{item.fav}</Text>
            <Text style={styles.textDate}>{item.date}</Text>
          </View>
        </View>
        
        <View style={styles.rightContainer}>
          <View
            style={[
              styles.counterContainer,
              { backgroundColor: fixedColors.bgColor },
            ]}
          >
            <Text style={styles.counter}>{item.counter}</Text>
          </View>
          
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity
                onPress={openMenu}
                style={styles.menuButton}
              >
                <MaterialIcons name="more-vert" size={24} color="#666" />
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}
          >
            <Menu.Item
              style={styles.menuItem}
              leadingIcon={() => (
                <MaterialIcons name="mode-edit" size={20} color="#007AFF" />
              )}
              onPress={handleOnEditPress}
              title={<Text style={styles.menuText}>{t("EDIT")}</Text>}
            />
            <Menu.Item
              style={styles.menuItem}
              leadingIcon={() => (
                <MaterialIcons name="delete" size={20} color="#FF3B30" />
              )}
              onPress={removeOnPress}
              title={<Text style={styles.menuText}>{t("REMOVE")}</Text>}
            />
          </Menu>
        </View>
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  box: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bodyContainer: {
    flex: 1,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  textFav: {
    color: "#1a1a1a",
    fontWeight: "700",
    fontSize: 18,
    fontFamily: "OpenSans",
    marginBottom: 4,
    lineHeight: 24,
  },
  textDate: {
    color: "#666",
    fontWeight: "400",
    fontSize: 14,
    fontFamily: "OpenSans",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  counterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
    alignItems: "center",
  },
  counter: {
    fontWeight: "700",
    fontSize: 18,
    color: "#ffffff",
    fontFamily: "OpenSans",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuContent: {
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    minWidth: 160,
  },
  menuItem: {
    height: 48,
    paddingHorizontal: 16,
  },
  menuText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "OpenSans",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
