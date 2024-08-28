import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../../redux/CounterSlice";
import { setTheme } from "../../utils/Theme/Theme";
import styles from "./FavCard.style";

const FavCard = ({ item, handleButtonClick }) => {
  const { currentIndex } = useSelector((state) => state.counter);

  const handleOnPress = (value) => {
    handleButtonClick(value);
  };

  const dispatch = useDispatch();

  const removeOnPress = () => {
    handleOnPress("button1");
    dispatch(removeFavorite(item.id));
  };
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.box,
          { backgroundColor: setTheme[currentIndex].cardColor },
        ]}
      >
        <View style={styles.bodyContainer}>
          <View>
            <Text style={styles.textFav}>{item.fav}</Text>
            <Text style={styles.textDate}>{item.date}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.counter,
            { backgroundColor: setTheme[currentIndex].bgColor },
          ]}
        >
          {item.counter}
        </Text>
        <TouchableOpacity onPress={removeOnPress} style={styles.removeBox}>
          <MaterialIcons name="delete" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FavCard;
