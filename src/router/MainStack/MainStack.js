import React, { useEffect } from "react";
import { AppState, Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../pages/HomeScreen/HomeScreen";
import FavoriteScreen from "../../pages/FavoriteScreen/FavoriteScreen";
import PrivacyPolicy from "../../pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../../pages/TermsOfService/TermsOfService";
import { setTheme } from "../../utils/Theme/Theme";
import { useSelector } from "react-redux";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import LeftArrow from "../../components/LeftArrow/LeftArrow";

const Stack = createStackNavigator();

const MainStack = () => {
  const { currentIndex, value } = useSelector((state) => state.counter);
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    const managePermissions = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            t("PERMISSION_DENIED_TITLE"),
            t("PERMISSION_DENIED_MESSAGE")
          );
          return;
        }
      }
    };

    managePermissions();

    const cancelPreviousNotifications = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
    };

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "background" && value !== 0) {
          setTimeout(() => {
            sendNotification();
          }, 1000);
        }
      }
    );

    const notificationResponseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const screen = response.notification.request.content.data.screen;
        if (screen) {
          navigation.navigate(screen);
        }
      });

    cancelPreviousNotifications();
    scheduleDailyNotifications();

    return () => {
      appStateSubscription.remove();
      notificationResponseSubscription.remove();
    };
  }, [value, navigation, t]);

  const sendNotification = async () => {
    if (value === 0) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t("APP_NAME"),
        body: `${t("COUNT")} ${value} - ${t("CLICK_TO_CONTINUE")}`,
        data: { screen: "Home" },
      },
      trigger: { seconds: 1 },
    });
  };

  const scheduleDailyNotifications = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t("APP_NAME"),
        body: t("MORNING"),
        data: { screen: "Home" },
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t("APP_NAME"),
        body: t("NIGHT"),
        data: { screen: "Home" },
      },
      trigger: {
        hour: 18,
        minute: 0,
        repeats: true,
      },
    });
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          title: t("TITLE"),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: setTheme[currentIndex].header,
            height: 80,
          },
          headerTitleStyle: {
            color: "#ffff",
            fontWeight: "700",
            fontSize: 24,
            fontFamily: "OpenSans",
            
          },
          headerLeft: ()=> <LeftArrow/>
        }}
        name="FavoriteScreen"
        component={FavoriteScreen}
      />
      <Stack.Screen
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#302e2e',
          },
          title: t("PRIVACY_POLICY"),
          headerTitleStyle:{
            color: '#fff'
          },
          headerTitleAlign: "center",
          headerLeft:()=> <LeftArrow/>
        }}
        name="PrivacyPolicy"
        component={PrivacyPolicy}
      />
      <Stack.Screen
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#302e2e',
          },
          headerTitleStyle:{
            color: '#fff'
          },
          title: t("TERMS_OF_SERVICE"),
          headerTitleAlign: "center",
          headerLeft:()=> <LeftArrow/>
        }}
        name="TermsOfService"
        component={TermsOfService}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
