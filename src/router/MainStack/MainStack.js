import React, { useEffect } from "react";
import { AppState, Alert, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../pages/HomeScreen/HomeScreen";
import FavoriteScreen from "../../pages/FavoriteScreen/FavoriteScreen";
import PrayerTimes from "../../pages/PrayerTimes/PrayerTimes";
import CitySelection from "../../pages/CitySelection/CitySelection";
import PrivacyPolicy from "../../pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../../pages/TermsOfService/TermsOfService";
import QuranSurahListScreen from "../../pages/Quran/QuranSurahListScreen";
import QuranReaderScreen from "../../pages/Quran/QuranReaderScreen";
import HadithListScreen from "../../pages/Hadith/HadithListScreen";
import HadithDetailScreen from "../../pages/Hadith/HadithDetailScreen";
import SavedVersesScreen from "../../pages/Saved/SavedVersesScreen";
import SavedHadithsScreen from "../../pages/Saved/SavedHadithsScreen";
import SourcesScreen from "../../pages/Sources/SourcesScreen";
import { fixedColors } from "../../utils/Theme/VectorTheme";
import { useSelector, useDispatch } from "react-redux";
import { fetchPrayerTimes } from "../../redux/CounterSlice";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import LeftArrow from "../../components/LeftArrow/LeftArrow";
import { scheduleDailyVerseNotifications } from "../../services/DailyVerseNotificationService";

const Stack = createStackNavigator();

const MainStack = () => {
  const { currentIndex, value, selectedCity } = useSelector((state) => state.counter);
  const contentLanguage = useSelector((state) => state.contentPrefs.contentLanguage);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  // 🔹 Android için bildirim kanalları oluştur
  useEffect(() => {
    if (Platform.OS === "android") {
      // Ana bildirim kanalı
      Notifications.setNotificationChannelAsync("daily-reminders", {
        name: "Günlük Hatırlatmalar",
        description: "Günlük zikir hatırlatmaları",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF0000",
      });

      // Arka plan bildirim kanalı
      Notifications.setNotificationChannelAsync("background-reminders", {
        name: "Arka Plan Hatırlatmaları",
        description: "Uygulama arka plandayken gelen hatırlatmalar",
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: "default",
      });
    }
  }, []);

  // 🔹 Uygulama ilk açıldığında izinleri kontrol et ve günlük bildirimleri planla
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // İzin kontrolü
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== "granted") {
            console.log("Bildirim izni verilmedi");
            return;
          }
        }

        // Bildirim ayarlarını yapılandır
        await Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });

        // Günlük bildirimleri planla
        await scheduleDailyNotifications();

        // Günün Ayeti bildirimleri (mevcut bildirimleri iptal etmeden eklenir)
        await scheduleDailyVerseNotifications(contentLanguage);

      } catch (error) {
        console.log("Bildirim başlatma hatası:", error);
      }
    };

    initializeNotifications();
  }, []);

  // 🔹 Namaz vakitleri için API isteği
  useEffect(() => {
    const fetchPrayerData = async () => {
      try {
        if (selectedCity) {
          const result = await dispatch(fetchPrayerTimes(selectedCity.name));
          
          if (result.payload) {
          } else {
            console.log('❌ MainStack: Namaz vakitleri yüklenemedi');
          }
        } else {
          const result = await dispatch(fetchPrayerTimes('Istanbul'));
          
          if (result.payload) {
          }
        }
      } catch (error) {
        console.log('❌ MainStack: Namaz vakitleri yükleme hatası:', error);
      }
    };

    fetchPrayerData();
  }, [selectedCity, dispatch]);

  // 🔹 Uygulama arka plana geçtiğinde bildirim tetikle
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background" && value !== 0) {
        // 5 saniye sonra bildirim gönder (kullanıcı geri dönebilir)
        setTimeout(() => {
          sendBackgroundNotification();
        }, 5000);
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, [value]);

  // 🔹 Arka Plan Bildirim Gönderme Fonksiyonu
  const sendBackgroundNotification = async () => {
    if (value === 0) {
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t("APP_NAME"),
          body: `${t("COUNT")} ${value} - ${t("CLICK_TO_CONTINUE")}`,
          data: { screen: "Home", type: "background" },
          categoryIdentifier: "background-reminder",
        },
        trigger: { type: 'timeInterval', seconds: 2 },
        identifier: "background-notification",
      });
    } catch (error) {
      console.log("Arka plan bildirimi gönderilemedi:", error);
    }
  };

  // 🔹 Günlük Bildirimleri Planlama Fonksiyonu
  const scheduleDailyNotifications = async () => {
    try {
      // Eski bildirimleri iptal et
      await Notifications.cancelAllScheduledNotificationsAsync();

      const NOTIFICATIONS = t("NOTIFICATIONS-MESSAGE");
      const fixedMessage = NOTIFICATIONS[0];
      
      const getRandomMessage = () => {
        const messages = NOTIFICATIONS.filter((msg, index) => index !== 0);
        return messages[Math.floor(Math.random() * messages.length)];
      };

      // Optimize edilmiş bildirim zamanları
      const notificationTimes = [
        { hour: 9, minute: 0, message: getRandomMessage(), type: "morning" },
        { hour: 12, minute: 30, message: getRandomMessage(), type: "lunch" },
        { hour: 18, minute: 0, message: getRandomMessage(), type: "evening" },
        { hour: 22, minute: 0, message: getRandomMessage(), type: "night" },
        { hour: 3, minute: 0, message: fixedMessage, type: "late" },
      ];

      for (const { hour, minute, message, type } of notificationTimes) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: t("APP_NAME"),
            body: message,
            data: { 
              screen: "Home", 
              type: "daily",
              notificationType: type 
            },
            categoryIdentifier: "daily-reminder",
            sound: "default",
          },
          trigger: {
            type: 'daily',
            hour,
            minute,
            repeats: true,
          },
          identifier: `daily-${type}-${hour}`,
        });
      }

      console.log("Günlük bildirimler başarıyla planlandı");
    } catch (error) {
      console.log("Günlük bildirimler planlanırken hata oluştu:", error);
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />

      {/* Keşfet / Qur'an / Hadith — screens render their own in-page headers */}
      <Stack.Screen options={{ headerShown: false }} name="QuranSurahList" component={QuranSurahListScreen} />
      <Stack.Screen options={{ headerShown: false }} name="QuranReader" component={QuranReaderScreen} />
      <Stack.Screen options={{ headerShown: false }} name="HadithList" component={HadithListScreen} />
      <Stack.Screen options={{ headerShown: false }} name="HadithDetail" component={HadithDetailScreen} />
      <Stack.Screen options={{ headerShown: false }} name="SavedVerses" component={SavedVersesScreen} />
      <Stack.Screen options={{ headerShown: false }} name="SavedHadiths" component={SavedHadithsScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Sources" component={SourcesScreen} />
      <Stack.Screen
        options={{
          title: t("TITLE"),
          
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: fixedColors.header,
            height: 80,
          },
          headerTitleStyle: {
            color: "#fff",
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
          title: t("PRAYER_TIMES"),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: fixedColors.header,
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
        name="PrayerTimes"
        component={PrayerTimes}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PrivacyPolicy"
        component={PrivacyPolicy}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="CitySelection"
        component={CitySelection}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="TermsOfService"
        component={TermsOfService}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
