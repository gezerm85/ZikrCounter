import { StyleSheet,Pressable } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { setTheme } from "../../utils/Theme/Theme";


const CustomButton = ({ onPress }) => {
  const { currentIndex } = useSelector((state) => state.counter);
  return (
    <Pressable
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
