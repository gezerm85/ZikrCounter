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

const ZikirCounterSkeleton = () => {
  const { value, vibrationEnabled, currentIndex } = useSelector(
    (state) => state.counter
  );

  const dispatch = useDispatch();
  const [sound, setSound] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSavePress = () => {
    setModalVisible(!isModalVisible);
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
    }
  };

  const handleResetPress = () => {
    if (value !== 0) {
      Alert.alert(
        "Sayacı Sıfırla",
        "Sayacı sıfırlamak istediğinize emin misiniz?",
        [
          {
            text: "Evet",
            onPress: resetPress,
          },
          {
            text: "Hayır",
            onPress: () => null,
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <ImageBackground
      imageStyle={styles.bgImg}
      source={setTheme[currentIndex].img}
      style={styles.container}
    >
      <View style={styles.bodyContainer}>
        <View style={styles.screenContainer}>
          <View style={styles.screen}>
            <Text style={styles.text}>{value}</Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.btnBox}>
            <Text style={styles.title}>KAYDET</Text>
            <Pressable onPress={handleSavePress} style={styles.smallCircle} />
          </View>
          <View style={styles.btnBox}>
            <Text style={styles.title}>SIFIRLA</Text>
            <Pressable onPress={handleResetPress} style={styles.smallCircle} />
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
    </ImageBackground>
  );
};
export default ZikirCounterSkeleton;
