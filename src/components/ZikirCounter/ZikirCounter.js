import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { increment, reset } from "../../redux/CounterSlice";
import { useAudioPlayer } from 'expo-audio';
import CustomButton from "../CustomButton/CustomButton";
import CustomModal from "../CustomModal/CustomModal";
import { vectorThemes, fixedColors } from "../../utils/Theme/VectorTheme";
import { useTranslation } from "react-i18next";
import CustomAlert from "../CustomAlert/CustomAlert";

const ZikirCounterSkeleton = ({ onButtonClick }) => {
  const { t } = useTranslation();

  const handleButtonPress = (value) => {
    onButtonClick(value);
  };

  const { value, currentIndex, fontSize } = useSelector(
    (state) => state.counter
  );

  const dispatch = useDispatch();
  
  // Audio player setup
  const player = useAudioPlayer(require('../../assets/sound/click.mp3'));
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSavePress = () => {
    handleButtonPress("button1");
    if (value !== 0) {
      setIsModalVisible(!isModalVisible);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };



  const handleOnPress = async () => {
    handleButtonPress("button4");
    
    // Play click sound
    try {
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.log('Ses çalma hatası:', error);
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
    if (value !== 0) {
      setModalVisible(true);
    }
  };

  return (
        <ImageBackground
        accessible={true}
        accessibilityLabel={"Home"}
          imageStyle={styles.bgImg}
          source={vectorThemes[currentIndex].img}
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

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 450,
    alignItems: "center",
    justifyContent: "center",
  },
  bgImg: {
    resizeMode: "contain",
  },
  title: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    fontFamily: "OpenSans",
    width: "100%",
    textAlign: "center",
  },
  bodyContainer: {
    height: "85%",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  screenContainer: {
    width: "100%",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    flexDirection: "row",
    width: "100%",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
    gap: 70,
  },
  btnContainer: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnText:{
    backgroundColor: 'red',
    fontSize: 22
  },
  bigCircle: {
    height: 155,
    width: 155,
    borderRadius: 600,
    backgroundColor: "#6D804C",
  },
  smallCircle: {
    backgroundColor: "#fff",
    height: 51,
    width: 51,
    borderRadius: 100,
  },
  screen: {
    backgroundColor: "#C3C3C3",
    height: "80%",
    width: "70%",
    borderRadius: 16,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  text: {
    color: "#000",
    height: "100%",
    fontFamily: "digital",
    textAlignVertical: "center",
    marginRight: 6,
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
