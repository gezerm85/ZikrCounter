import { StyleSheet,Pressable } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { setTheme } from "../../utils/Theme/Theme";
import { useTranslation } from "react-i18next";


const CustomButton = ({ onPress }) => {
  const {t} = useTranslation()
  const { currentIndex } = useSelector((state) => state.counter);
  return (
    <Pressable
    accessible={true}
    accessibilityLabel={t('INCREASE')}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? setTheme[currentIndex].main
            : setTheme[currentIndex].main,
          height: 155,
          width: 155,
          borderRadius: 600,
        },
      ]}
    />
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
