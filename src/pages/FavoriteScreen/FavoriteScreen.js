import { FlatList, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import FavCard from "../../components/FavCard/FavCard";
import moment from "moment";
import "moment/locale/tr";
import { setTheme } from "../../utils/Theme/Theme";
import styles from "./FavoriteScreen.style";

moment.locale("tr");

const FavoriteScreen = () => {
  const { favorite, currentIndex } = useSelector((state) => state.counter);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: setTheme[currentIndex].bgColor },
      ]}
    >
      {favorite.length == 0 ? (
        <Text style={styles.title}> Zikir bulunmamaktadır.</Text>
      ) : (
        <FlatList
          data={favorite}
          renderItem={({ item }) => <FavCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default FavoriteScreen;
