import {
  Text,
  View,
  Pressable,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFontSize } from "../../redux/CounterSlice";
// Using built-in Modal instead of react-native-modal
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const SettingsModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation();

  const nav = useNavigation();

  const dispatch = useDispatch();

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

  const { fontSize } = useSelector((state) => state.counter);

  const buttonSizes = [64, 68, 72, 76];

  const fontSizeLabels = {
    64: t('FONT_SIZE_64'),
    68: t('FONT_SIZE_68'),
    72: t('FONT_SIZE_72'),
    76: t('FONT_SIZE_76'),
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("SETTINGS")}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </Pressable>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("FONT_SIZE")}</Text>
            <View style={styles.fontContainer}>
              {buttonSizes.map((size, index) => {
                const isSelected = fontSize === size;
                const fontLabel = fontSizeLabels[size];

                return (
                  <TouchableOpacity
                    style={[
                      styles.fontBtn,
                      isSelected && styles.fontBtnSelected
                    ]}
                    accessible={true}
                    accessibilityLabel={fontLabel}
                    key={size}
                    onPress={() => dispatch(setFontSize(size))}
                  >
                    <Text style={[
                      styles.fontSizeText,
                      isSelected && styles.fontSizeTextSelected
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("MORE")}</Text>
            <View style={styles.menuContainer}>
              <Pressable style={styles.menuItem} onPress={null}>
                <View style={styles.menuIconContainer}>
                  <FontAwesome name="star" size={20} color="#FFD700" />
                </View>
                <Text style={styles.menuText}>{t("RATE_US")}</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </Pressable>
              
              <Pressable style={styles.menuItem} onPress={handleEmailPress}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="mail" size={20} color="#007AFF" />
                </View>
                <Text style={styles.menuText}>{t("SUPPORT")}</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </Pressable>
              
              <Pressable
                style={styles.menuItem}
                onPress={() => nav.navigate("PrivacyPolicy")}
              >
                <View style={styles.menuIconContainer}>
                  <MaterialIcons name="security" size={20} color="#34C759" />
                </View>
                <Text style={styles.menuText}>{t("PRIVACY_POLICY")}</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </Pressable>
              
            <Pressable
              style={styles.menuItem}
              onPress={() => nav.navigate("PrayerTimes")}
            >
              <View style={styles.menuIconContainer}>
                <MaterialIcons name="schedule" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.menuText}>Namaz Vakitleri</Text>
              <MaterialIcons name="chevron-right" size={20} color="#ccc" />
            </Pressable>
            
            <Pressable
              style={styles.menuItem}
              onPress={() => nav.navigate("TermsOfService")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="document-text" size={20} color="#FF9500" />
              </View>
              <Text style={styles.menuText}>{t("TERMS_OF_SERVICE")}</Text>
              <MaterialIcons name="chevron-right" size={20} color="#ccc" />
            </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "OpenSans",
    color: "#1a1a1a",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "OpenSans",
    color: "#666",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fontContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  fontBtn: {
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "transparent",
  },
  fontBtnSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "OpenSans",
    color: "#666",
  },
  fontSizeTextSelected: {
    color: "#fff",
  },
  menuContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "OpenSans",
    color: "#1a1a1a",
  },
});
