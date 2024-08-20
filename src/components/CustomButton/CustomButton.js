import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { setTheme } from "../../utils/Theme/Theme";

const { width, height } = Dimensions.get("window");

const CustomButton = ({ onPress }) => {
  const { currentIndex } = useSelector((state) => state.counter);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? setTheme[currentIndex].topBar
            : setTheme[currentIndex].topBar,
          height: 155,
          width: 155,
          borderRadius: 600,
          shadowColor: "#8c8282",
          shadowOffset: {
            width: 0,
            height: pressed ? 5 : 10,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: pressed ? 5 : 10,
        },
      ]}
    />
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
