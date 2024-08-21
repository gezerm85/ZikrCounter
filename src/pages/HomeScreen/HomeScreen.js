import { Pressable, Text, View, Vibration, StatusBar } from "react-native";
import React, { useState } from "react";
import ZikirCounter from "../../components/ZikirCounter/ZikirCounter";
import { useSelector, useDispatch } from "react-redux";
import * as Speech from "expo-speech";
import AntDesign from "@expo/vector-icons/AntDesign";
import { changeGradientColor } from "../../redux/CounterSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SettingsModal from "../../components/SettingsModal/SettingsModal";
import { useNavigation } from "@react-navigation/native";
import { setTheme } from "../../utils/Theme/Theme";
import styles from "./HomeScreen.style";

const HomeScreen = () => {
  const [isSettingsModal, setIsSettingsModal] = useState(false);

  const dispatch = useDispatch();

  const nav = useNavigation();

  const { value, vibrationEnabled, currentIndex } = useSelector(
    (state) => state.counter
  );

  const SettingsModalToggle = () => {
    setIsSettingsModal(!isSettingsModal);
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  const OnPress = () => {
    setIsSettingsModal(!isSettingsModal);
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
  };

  const speakNumber = () => {
    if (vibrationEnabled == true) {
      Vibration.vibrate(25);
    }
    const numberText = value.toString();
    Speech.speak(numberText);
  };

  const handleChangeColor = () => {
    dispatch(changeGradientColor());
  };
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: setTheme[currentIndex].bgColor },
      ]}
    >
      <StatusBar barStyle="default" />

      <View style={styles.btnContainer}>
        <Pressable
          style={[
            styles.btnBox,
            { backgroundColor: setTheme[currentIndex].cardColor },
          ]}
          onPress={OnPress}
        >
          <MaterialIcons name="settings" size={24} color="#000" />
        </Pressable>
        <Pressable
          style={[
            styles.btnBox,
            { backgroundColor: setTheme[currentIndex].cardColor },
          ]}
          onPress={handleChangeColor}
        >
          <MaterialCommunityIcons name="format-paint" size={24} color="#000" />
        </Pressable>
        <Pressable
          style={[
            styles.btnBox,
            { backgroundColor: setTheme[currentIndex].cardColor },
          ]}
          onPress={speakNumber}
        >
          <AntDesign name="sound" size={24} color="#000" />
        </Pressable>
        <Pressable
          style={[
            styles.btnBox,
            { backgroundColor: setTheme[currentIndex].cardColor },
          ]}
          onPress={() => nav.navigate("FavoriteScreen")}
        >
          <FontAwesome5 name="quran" size={24} color="black" />
        </Pressable>
      </View>
      <View style={styles.bodyContainer}>
        <ZikirCounter />
      </View>
      <View style={styles.bottomContainer}>
        <Text>ASFAF</Text>
      </View>
      {isSettingsModal && (
        <View style={styles.modalOverlay}>
          <SettingsModal
            isVisible={isSettingsModal}
            onClose={SettingsModalToggle}
          />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
