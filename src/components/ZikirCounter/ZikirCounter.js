import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { increment, reset } from "../../redux/CounterSlice";
import { useAudioPlayer } from "expo-audio";
import Feather from "@expo/vector-icons/Feather";
import CustomButton from "../CustomButton/CustomButton";
import CustomModal from "../CustomModal/CustomModal";
import CustomAlert from "../CustomAlert/CustomAlert";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import { useTranslation } from "react-i18next";

const TARGET = 33;

const ZikirCounterSkeleton = ({ onButtonClick }) => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();

  const { value, fontSize } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  const player = useAudioPlayer(require("../../assets/sound/click.mp3"));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonPress = (v) => onButtonClick(v);

  const handleSavePress = () => {
    handleButtonPress("button1");
    if (value !== 0) setIsModalVisible(true);
  };

  const toggleModal = () => setIsModalVisible((v) => !v);
  const handleClose = () => setModalVisible(false);

  const handleOnPress = async () => {
    handleButtonPress("button4");
    try {
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.log("Ses çalma hatası:", error);
    }
    dispatch(increment());
  };

  const resetPress = () => {
    if (value !== 0) {
      dispatch(reset());
      setModalVisible(false);
    }
  };

  const handleResetPress = () => {
    handleButtonPress("button1");
    if (value !== 0) setModalVisible(true);
  };

  const laps = Math.floor(value / TARGET);
  const inLap = value % TARGET;

  return (
    <View style={styles.wrap}>
      {/* Brand */}
      <View style={{ alignItems: "center", marginBottom: 22 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: "700", color: c.ink }}>
          {t("APP_NAME")}
        </Text>
        <Text style={{ fontFamily: fonts.ui, fontSize: 13, color: c.muted, marginTop: 2 }}>
          Bismillâhirrahmânirrahîm
        </Text>
      </View>

      {/* Device */}
      <View
        style={[
          styles.device,
          { backgroundColor: c.surface, borderColor: c.line, shadowColor: c.shadow },
        ]}
      >
        {/* LCD screen */}
        <View style={[styles.screen, { backgroundColor: c.screen }]}>
          <Text style={[styles.ghost, { color: c.lcdInk }]}>88</Text>
          <Text style={[styles.lcd, { color: c.lcdInk, fontSize: fontSize }]}>{value}</Text>
        </View>
        {/* lap indicator */}
        <View style={styles.lapRow}>
          <Text style={{ fontFamily: fonts.mono, fontSize: 13, color: c.muted, letterSpacing: 1 }}>
            TUR {laps} · {inLap} / {TARGET}
          </Text>
        </View>

        {/* Save / Reset */}
        <View style={styles.actionRow}>
          <View style={{ alignItems: "center", gap: 6 }}>
            <Pressable
              accessible
              accessibilityLabel={"save"}
              onPress={handleSavePress}
              style={({ pressed }) => [styles.roundBtn, { backgroundColor: c.goldSoft, opacity: pressed ? 0.7 : 1 }]}
            >
              <Feather name="bookmark" size={22} color={c.gold} />
            </Pressable>
            <Text style={{ fontFamily: fonts.ui, fontSize: 12, fontWeight: "600", color: c.inkSoft }}>{t("SAVE")}</Text>
          </View>
          <View style={{ alignItems: "center", gap: 6 }}>
            <Pressable
              accessible
              accessibilityLabel={"Reset"}
              onPress={handleResetPress}
              style={({ pressed }) => [styles.roundBtn, { backgroundColor: c.goldSoft, opacity: pressed ? 0.7 : 1 }]}
            >
              <Feather name="rotate-ccw" size={22} color={c.gold} />
            </Pressable>
            <Text style={{ fontFamily: fonts.ui, fontSize: 12, fontWeight: "600", color: c.inkSoft }}>{t("RESET")}</Text>
          </View>
        </View>
      </View>

      {/* ÇEK button */}
      <View style={styles.bigBtnWrap}>
        <CustomButton onPress={handleOnPress} />
      </View>

      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <CustomModal isVisible={isModalVisible} onClose={toggleModal} />
        </View>
      )}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <CustomAlert onClose={handleClose} visible={modalVisible} onConfirm={resetPress} />
        </View>
      )}
    </View>
  );
};

export default ZikirCounterSkeleton;

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  device: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
    alignItems: "center",
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  screen: {
    width: "100%",
    height: 130,
    borderRadius: 18,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 22,
    overflow: "hidden",
  },
  ghost: {
    position: "absolute",
    right: 22,
    fontFamily: "digital",
    fontSize: 84,
    opacity: 0.12,
  },
  lcd: {
    fontFamily: "digital",
    includeFontPadding: false,
  },
  lapRow: {
    marginTop: 14,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 64,
    marginTop: 14,
  },
  roundBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  bigBtnWrap: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
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
