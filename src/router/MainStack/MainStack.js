import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../pages/HomeScreen/HomeScreen";
import FavoriteScreen from "../../pages/FavoriteScreen/FavoriteScreen";
import PrivacyPolicy from "../../pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../../pages/TermsOfService/TermsOfService";
import { setTheme } from "../../utils/Theme/Theme";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();

const MainStack = () => {
  const { currentIndex } = useSelector((state) => state.counter);

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          title: "Zikir Defterim",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: setTheme[currentIndex].topBar,
            height: 80,
          },
          headerTitleStyle: {
            color: "#ffff",
            fontWeight: "400",
            fontSize: 22,
            fontFamily: "OpenSans",
          },
          headerTintColor: "#fff",
        }}
        name="FavoriteScreen"
        component={FavoriteScreen}
      />
      <Stack.Screen
        options={{
          headerStyle: {
            height: 80,
          },
        }}
        name="PrivacyPolicy"
        component={PrivacyPolicy}
      />
      <Stack.Screen
        options={{
          headerStyle: {
            height: 80,
          },
        }}
        name="TermsOfService"
        component={TermsOfService}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
