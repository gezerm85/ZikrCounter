import { Text, View, Switch, Pressable, Linking } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVibrationEnabled } from "../../redux/CounterSlice";
import Modal from "react-native-modal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import styles from "./SettingsModal.style";

const SettingsModal = ({ isVisible, onClose }) => {
  const nav = useNavigation();

  const dispatch = useDispatch();
  const toggleSwitch = () => {
    dispatch(setVibrationEnabled());
  };

  const handleEmailPress = () => {
    const email = "example@example.com";
    const subject = "Destek Talebi";
    const body =
      "Merhaba, uygulamanızla ilgili bir sorun yaşıyorum. Yardımcı olabilir misiniz?";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl)
      .then((supported) => {
        if (!supported) {
          alert("Mail uygulaması açılamadı");
        }
      })
      .catch((error) => console.log("Error:", error));
  };

  const { vibrationEnabled } = useSelector((state) => state.counter);
  return (
    <View>
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>Ayarlar</Text>
          <View style={styles.bodyContainer}>
            {vibrationEnabled ? (
              <MaterialIcons name="vibration" size={24} color="black" />
            ) : (
              <MaterialCommunityIcons
                name="vibrate-off"
                size={24}
                color="black"
              />
            )}
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={vibrationEnabled ? "#1667e1" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={vibrationEnabled}
            />
          </View>
          <View style={styles.innerContainer}>
            <Pressable style={styles.btnBox} onPress={null}>
              <FontAwesome name="star" size={24} color="#8b8787" />
              <Text style={styles.text}>Bizi Puanlayın</Text>
            </Pressable>
            <Pressable style={styles.btnBox} onPress={handleEmailPress}>
              <Ionicons name="mail" size={24} color="#8b8787" />
              <Text style={styles.text}>Bize Yazın</Text>
            </Pressable>
            <Pressable
              style={styles.btnBox}
              onPress={() => nav.navigate("PrivacyPolicy")}
            >
              <MaterialIcons name="security" size={24} color="#8b8787" />
              <Text style={styles.text}>Gizlilik Politikası</Text>
            </Pressable>
            <Pressable
              style={styles.btnBox}
              onPress={() => nav.navigate("TermsOfService")}
            >
              <Ionicons name="document-text" size={24} color="#8b8787" />
              <Text style={styles.text}>Hizmet Koşulları</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsModal;
