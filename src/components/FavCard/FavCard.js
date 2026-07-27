import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { useDispatch } from "react-redux";
import { removeFavorite } from "../../redux/CounterSlice";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import { Menu } from "react-native-paper";
import EditModal from "../EditModal/EditModal";
import { useTranslation } from "react-i18next";

const FavCard = ({ item, handleButtonClick }) => {
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  const dispatch = useDispatch();

  const handleOnEditPress = () => {
    setModalVisible(true);
    setVisible(false);
  };
  const toggleModal = () => setModalVisible((v) => !v);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const removeOnPress = () => {
    handleButtonClick("button1");
    dispatch(removeFavorite(item.id));
  };

  return (
    <View accessible={true} accessibilityLabel={"Card"} style={styles.container}>
      <View style={[styles.box, { backgroundColor: c.card, borderColor: c.line, shadowColor: c.shadow }]}>
        <View style={[styles.iconChip, { backgroundColor: c.goldSoft }]}>
          <Feather name="feather" size={22} color={c.gold} />
        </View>

        <View style={styles.bodyContainer}>
          <Text style={[styles.textFav, { color: c.ink, fontFamily: fonts.ui }]}>{item.fav}</Text>
          <Text style={[styles.textDate, { color: c.muted, fontFamily: fonts.ui }]}>{item.date}</Text>
        </View>

        <View style={styles.rightContainer}>
          <View style={[styles.counterContainer, { backgroundColor: c.goldSoft }]}>
            <Text style={[styles.counter, { color: c.goldInk, fontFamily: fonts.ui }]}>{item.counter}×</Text>
          </View>

          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
                <MaterialIcons name="more-vert" size={22} color={c.muted} />
              </TouchableOpacity>
            }
            contentStyle={{ borderRadius: 12, backgroundColor: c.surface }}
          >
            <Menu.Item
              leadingIcon={() => <MaterialIcons name="mode-edit" size={20} color={c.gold} />}
              onPress={handleOnEditPress}
              title={<Text style={{ color: c.ink, fontSize: 16, fontFamily: fonts.ui }}>{t("EDIT")}</Text>}
            />
            <Menu.Item
              leadingIcon={() => <MaterialIcons name="delete" size={20} color="#FF3B30" />}
              onPress={removeOnPress}
              title={<Text style={{ color: c.ink, fontSize: 16, fontFamily: fonts.ui }}>{t("REMOVE")}</Text>}
            />
          </Menu>
        </View>
      </View>

      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <EditModal isVisible={isModalVisible} onClose={toggleModal} selectedItem={item} />
        </View>
      )}
    </View>
  );
};

export default FavCard;

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  box: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  iconChip: { width: 50, height: 50, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  bodyContainer: { flex: 1 },
  textFav: { fontWeight: "700", fontSize: 16, marginBottom: 4, lineHeight: 22 },
  textDate: { fontWeight: "400", fontSize: 13 },
  rightContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  counterContainer: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, alignItems: "center" },
  counter: { fontWeight: "700", fontSize: 14 },
  menuButton: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" },
});
