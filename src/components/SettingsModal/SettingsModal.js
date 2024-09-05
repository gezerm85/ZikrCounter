import {
  Text,
  View,
  Switch,
  Pressable,
  Linking,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFontSize, setVibrationEnabled } from "../../redux/CounterSlice";
import Modal from "react-native-modal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import styles from "./SettingsModal.style";
import { useTranslation } from "react-i18next";

const SettingsModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation();

  const nav = useNavigation();

  const dispatch = useDispatch();
  const toggleSwitch = () => {
    dispatch(setVibrationEnabled());
  };

  const handleEmailPress = () => {
    const email = "mobiflextech@gmail.com";
    const subject = t("SUPPORT_REQUEST");
    const body = t("SUPPORT_MESSAGE");
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl)
      .then((supported) => {
        if (!supported) {
          alert(t("MAIL_ERROR"));
        }
      })
      .catch((error) => console.log("Error:", error));
  };

  const { vibrationEnabled, fontSize } = useSelector((state) => state.counter);

  const buttonSizes = [64, 68, 72, 76];

  const fontSizeLabels = {
    64: t('FONT_SIZE_64'),
    68: t('FONT_SIZE_68'),
    72: t('FONT_SIZE_72'),
    76: t('FONT_SIZE_76'),
  };

  return (
    <View accessible={true} accessibilityLabel={"SETTINGS1"}>
      <Modal
        accessible={true}
        accessibilityLabel={"SETTINGS2"}
        isVisible={isVisible}
        onBackdropPress={onClose}
      >
        <View
          style={styles.container}
          accessible={true}
          accessibilityLabel={"SETTINGS3"}
        >
          <Text style={styles.title}>{t("SETTINGS")}</Text>
          <View style={styles.bodyContainer}>
            {vibrationEnabled ? (
              <MaterialIcons name="vibration" size={32} color="black" />
            ) : (
              <MaterialCommunityIcons
                name="vibrate-off"
                size={32}
                color="black"
              />
            )}
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={vibrationEnabled ? "#1667e1" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={vibrationEnabled}
                style={styles.switch}
              />
            </View>
          </View>
          <View style={styles.fontContainer}>
            {buttonSizes.map((size, index) => {
              const iconName =
                size === fontSize || size > fontSize
                  ? "format-font-size-increase"
                  : "format-font-size-decrease";
              const iconColor = fontSize === size ? "#1667e1" : "#8b8787";
              const fontLabel = fontSizeLabels[size];

              
              

              return (
                <TouchableOpacity
                  style={styles.fontBtn}
                  accessible={true}
                  accessibilityLabel={fontLabel}
                  key={size}
                  onPress={() => dispatch(setFontSize(size))}
                >
                  <MaterialCommunityIcons
                    name={iconName}
                    size={40}
                    color={iconColor}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.innerContainer}>
            <Pressable style={styles.btnBox} onPress={null}>
              <FontAwesome name="star" size={32} color="#8b8787" />
              <Text style={styles.text}>{t("RATE_US")}</Text>
            </Pressable>
            <Pressable style={styles.btnBox} onPress={handleEmailPress}>
              <Ionicons name="mail" size={32} color="#8b8787" />
              <Text style={styles.text}>{t("SUPPORT")}</Text>
            </Pressable>
            <Pressable
              style={styles.btnBox}
              onPress={() => nav.navigate("PrivacyPolicy")}
            >
              <MaterialIcons name="security" size={32} color="#8b8787" />
              <Text style={styles.text}>{t("PRIVACY_POLICY")}</Text>
            </Pressable>
            <Pressable
              style={styles.btnBox}
              onPress={() => nav.navigate("TermsOfService")}
            >
              <Ionicons name="document-text" size={32} color="#8b8787" />
              <Text style={styles.text}>{t("TERMS_OF_SERVICE")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsModal;
