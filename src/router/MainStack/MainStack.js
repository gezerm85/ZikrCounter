import React, { useEffect } from "react";
import { AppState, Alert, Platform } from "react-native";
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

  // 🔹 Android için bildirim kanalı oluştur
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }
  }, []);

  // 🔹 Uygulama ilk açıldığında izinleri kontrol et ve günlük bildirimleri planla
  useEffect(() => {

    const managePermissions = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(t("PERMISSION_DENIED_TITLE"), t("PERMISSION_DENIED_MESSAGE"));
          return;
        }
      }
    };

    managePermissions();
    scheduleDailyNotifications();

  }, []);

  // 🔹 Uygulama arka plana geçtiğinde bildirim tetikle
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background" && value !== 0) {
        sendNotification();
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, [value]);

  // 🔹 Bildirim Gönderme Fonksiyonu
  const sendNotification = async () => {
    if (value === 0) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t("APP_NAME"),
        body: `${t("COUNT")} ${value} - ${t("CLICK_TO_CONTINUE")}`,
        data: { screen: "Home" },
      },
      trigger: { seconds: 3 }, // 🔹 Test için tetikleyiciyi 3 saniye yaptık
    });
  };

  // 🔹 Günlük Bildirimleri Planlama Fonksiyonu
  const scheduleDailyNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync(); // 🔹 Eski bildirimleri iptal et

    const NOTIFICATIONS = t("NOTIFICATIONS");
    const fixedMessage = NOTIFICATIONS[0];
    const getRandomMessage = () => {
      const messages = NOTIFICATIONS.filter((msg, index) => index !== 0);
      return messages[Math.floor(Math.random() * messages.length)];
    };

    try {
      const notificationTimes = [
        { hour: 9, message: getRandomMessage() },
        { hour: 12, message: getRandomMessage() },
        { hour: 18, message: getRandomMessage() },
        { hour: 22, message: getRandomMessage() },
        { hour: 3, message: fixedMessage },
      ];

      for (const { hour, message } of notificationTimes) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: t("APP_NAME"),
            body: message,
            data: { screen: "Home" },
          },
          trigger: {
            hour,
            minute: 0,
            repeats: true,
          },
        });
      }

    } catch (error) {
      console.log("Günlük bildirimler planlanırken hata oluştu:", error);
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
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
          headerLeft: () => <LeftArrow />,
        }}
        name="FavoriteScreen"
        component={FavoriteScreen}
      />
      <Stack.Screen
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: "#302e2e",
          },
          title: t("PRIVACY_POLICY"),
          headerTitleStyle: {
            color: "#fff",
          },
          headerTitleAlign: "center",
          headerLeft: () => <LeftArrow />,
        }}
        name="PrivacyPolicy"
        component={PrivacyPolicy}
      />
      <Stack.Screen
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: "#302e2e",
          },
          headerTitleStyle: {
            color: "#fff",
          },
          title: t("TERMS_OF_SERVICE"),
          headerTitleAlign: "center",
          headerLeft: () => <LeftArrow />,
        }}
        name="TermsOfService"
        component={TermsOfService}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
