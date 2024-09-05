import React, { useState, useEffect } from "react";
import {
  Vibration,
  View,
  Pressable,
  Alert,
  Text,
  ImageBackground,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { increment, reset } from "../../redux/CounterSlice";
import { Audio } from "expo-av";
import CustomButton from "../CustomButton/CustomButton";
import CustomModal from "../CustomModal/CustomModal";
import { setTheme } from "../../utils/Theme/Theme";
import styles from "./ZikirCounter.style";
import { useTranslation } from "react-i18next";
import CustomAlert from "../CustomAlert/CustomAlert";

const ZikirCounterSkeleton = ({ onButtonClick }) => {
  const { t } = useTranslation();

  const handleButtonPress = (value) => {
    onButtonClick(value);
  };

  const { value, vibrationEnabled, currentIndex, fontSize } = useSelector(
    (state) => state.counter
  );

  const dispatch = useDispatch();
  const [sound, setSound] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSavePress = () => {
    handleButtonPress("button1");
    if (value !== 0) {
      setIsModalVisible(!isModalVisible);
      if (vibrationEnabled == true) {
        Vibration.vibrate(25);
      }
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sound/click.mp3")
      );
      setSound(sound);
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [dispatch]);

  const handleOnPress = async () => {
    handleButtonPress("button4");
    if (vibrationEnabled) {
      Vibration.vibrate(25);
    }

    if (sound) {
      await sound.replayAsync();
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
    if (vibrationEnabled) {
      Vibration.vibrate(25);
    }
    if (value !== 0) {
      setModalVisible(true);
    }
  };

  return (
    <ImageBackground
    accessible={true}
    accessibilityLabel={"Home"}
      imageStyle={styles.bgImg}
      source={setTheme[currentIndex].img}
      style={styles.container}
    >
      <View style={styles.bodyContainer}>
        <View style={styles.screenContainer}>
          <View style={styles.screen}>
            <Text style={[styles.text, { fontSize: fontSize }]}>{value}</Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.btnBox}>
            <Text style={styles.title}>{t("SAVE")}</Text>
            <Pressable
              accessible={true}
              accessibilityLabel={"save"}
              onPress={handleSavePress}
              style={styles.smallCircle}
            />
          </View>
          <View style={styles.btnBox}>
            <Text style={styles.title}>{t("RESET")}</Text>
            <Pressable
              accessible={true}
              accessibilityLabel={"Reset"}
              onPress={handleResetPress}
              style={styles.smallCircle}
            />
          </View>
        </View>
        <View style={styles.btnContainer}>
          <CustomButton onPress={handleOnPress} />
        </View>
      </View>

      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <CustomModal isVisible={isModalVisible} onClose={toggleModal} />
        </View>
      )}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <CustomAlert
            onClose={handleClose}
            visible={modalVisible}
            onConfirm={resetPress}
          />
        </View>
      )}
    </ImageBackground>
  );
};
export default ZikirCounterSkeleton;
