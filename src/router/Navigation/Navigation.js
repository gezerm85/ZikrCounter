import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import {
  fetchStorage,
  fetchFavorites,
  fetchCurrentIndex,
  fetchVibrationEnabled,
} from "../../redux/CounterSlice";
import MainStack from "../MainStack/MainStack";

const Navigation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStorage());
    dispatch(fetchFavorites());
    dispatch(fetchCurrentIndex());
    dispatch(fetchVibrationEnabled());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default Navigation;
