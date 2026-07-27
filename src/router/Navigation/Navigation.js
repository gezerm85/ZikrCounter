import React, { useEffect } from "react";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import { useDispatch } from "react-redux";
import {
  fetchStorage,
  fetchFavorites,
  fetchCurrentIndex,
  fetchFontSize,
  fetchSelectedCity,
  fetchPrayerTimes,
  setNotificationPermission,
  setSelectedCity,
} from "../../redux/CounterSlice";
import { hydrateSavedContent } from "../../redux/SavedContentSlice";
import { hydrateContentPrefs } from "../../redux/ContentPrefsSlice";
import PrayerNotificationService from "../../services/PrayerNotificationService";
import BackgroundTaskService from "../../services/BackgroundTaskService";
import * as Location from 'expo-location';
import BottomTabs from "../BottomTabs/BottomTabs";
import MainStack from "../MainStack/MainStack";

const RootStack = createStackNavigator();
export const navigationRef = createNavigationContainerRef();

// Open the exact ayah when a "Verse of the Day" notification is tapped.
const handleNotificationResponse = (response) => {
  const data = response?.notification?.request?.content?.data;
  if (data?.type === "daily_verse" && data.surahNumber) {
    const go = () =>
      navigationRef.navigate("MainStack", {
        screen: "QuranReader",
        params: { surahNumber: data.surahNumber, focusAyah: data.ayahNumber },
      });
    if (navigationRef.isReady()) go();
    else setTimeout(go, 800);
  }
};

// Konum tespit fonksiyonu
const findNearestCity = (lat, lng) => {
  // Tüm 81 ilin koordinatları
  const allCities = [
    { id: 1, name: 'Adana', code: 'adana', lat: 37.0000, lng: 35.3213 },
    { id: 2, name: 'Adıyaman', code: 'adiyaman', lat: 37.7636, lng: 38.2786 },
    { id: 3, name: 'Afyonkarahisar', code: 'afyonkarahisar', lat: 38.7507, lng: 30.5567 },
    { id: 4, name: 'Ağrı', code: 'agri', lat: 39.7191, lng: 43.0503 },
    { id: 5, name: 'Amasya', code: 'amasya', lat: 40.6499, lng: 35.8353 },
    { id: 6, name: 'Ankara', code: 'ankara', lat: 39.9334, lng: 32.8597 },
    { id: 7, name: 'Antalya', code: 'antalya', lat: 36.8969, lng: 30.7133 },
    { id: 8, name: 'Artvin', code: 'artvin', lat: 41.1828, lng: 41.8183 },
    { id: 9, name: 'Aydın', code: 'aydin', lat: 37.8560, lng: 27.8416 },
    { id: 10, name: 'Balıkesir', code: 'balikesir', lat: 39.6484, lng: 27.8826 },
    { id: 11, name: 'Bilecik', code: 'bilecik', lat: 40.1425, lng: 29.9793 },
    { id: 12, name: 'Bingöl', code: 'bingol', lat: 38.8847, lng: 40.4982 },
    { id: 13, name: 'Bitlis', code: 'bitlis', lat: 38.3938, lng: 42.1232 },
    { id: 14, name: 'Bolu', code: 'bolu', lat: 40.7316, lng: 31.5895 },
    { id: 15, name: 'Burdur', code: 'burdur', lat: 37.7206, lng: 30.2906 },
    { id: 16, name: 'Bursa', code: 'bursa', lat: 40.1826, lng: 29.0665 },
    { id: 17, name: 'Çanakkale', code: 'canakkale', lat: 40.1553, lng: 26.4142 },
    { id: 18, name: 'Çankırı', code: 'cankiri', lat: 40.6013, lng: 33.6134 },
    { id: 19, name: 'Çorum', code: 'corum', lat: 40.5506, lng: 34.9556 },
    { id: 20, name: 'Denizli', code: 'denizli', lat: 37.7765, lng: 29.0864 },
    { id: 21, name: 'Diyarbakır', code: 'diyarbakir', lat: 37.9144, lng: 40.2306 },
    { id: 22, name: 'Edirne', code: 'edirne', lat: 41.6771, lng: 26.5557 },
    { id: 23, name: 'Elazığ', code: 'elazig', lat: 38.6810, lng: 39.2264 },
    { id: 24, name: 'Erzincan', code: 'erzincan', lat: 39.7500, lng: 39.5000 },
    { id: 25, name: 'Erzurum', code: 'erzurum', lat: 39.9334, lng: 41.2756 },
    { id: 26, name: 'Eskişehir', code: 'eskisehir', lat: 39.7767, lng: 30.5206 },
    { id: 27, name: 'Gaziantep', code: 'gaziantep', lat: 37.0662, lng: 37.3833 },
    { id: 28, name: 'Giresun', code: 'giresun', lat: 40.9128, lng: 38.3895 },
    { id: 29, name: 'Gümüşhane', code: 'gumushane', lat: 40.4603, lng: 39.5086 },
    { id: 30, name: 'Hakkâri', code: 'hakkari', lat: 37.5833, lng: 43.7333 },
    { id: 31, name: 'Hatay', code: 'hatay', lat: 36.4018, lng: 36.3498 },
    { id: 32, name: 'Isparta', code: 'isparta', lat: 37.7648, lng: 30.5566 },
    { id: 33, name: 'Mersin', code: 'mersin', lat: 36.8000, lng: 34.6333 },
    { id: 34, name: 'İstanbul', code: 'istanbul', lat: 41.0082, lng: 28.9784 },
    { id: 35, name: 'İzmir', code: 'izmir', lat: 38.4192, lng: 27.1287 },
    { id: 36, name: 'Kars', code: 'kars', lat: 40.6013, lng: 43.0975 },
    { id: 37, name: 'Kastamonu', code: 'kastamonu', lat: 41.3887, lng: 33.7827 },
    { id: 38, name: 'Kayseri', code: 'kayseri', lat: 38.7312, lng: 35.4787 },
    { id: 39, name: 'Kırklareli', code: 'kirklareli', lat: 41.7350, lng: 27.2256 },
    { id: 40, name: 'Kırşehir', code: 'kirsehir', lat: 39.1425, lng: 34.1709 },
    { id: 41, name: 'Kocaeli', code: 'kocaeli', lat: 40.8533, lng: 29.8815 },
    { id: 42, name: 'Konya', code: 'konya', lat: 37.8746, lng: 32.4932 },
    { id: 43, name: 'Kütahya', code: 'kutahya', lat: 39.4189, lng: 29.9833 },
    { id: 44, name: 'Malatya', code: 'malatya', lat: 38.3552, lng: 38.3095 },
    { id: 45, name: 'Manisa', code: 'manisa', lat: 38.6191, lng: 27.4289 },
    { id: 46, name: 'Kahramanmaraş', code: 'kahramanmaras', lat: 37.5858, lng: 36.9371 },
    { id: 47, name: 'Mardin', code: 'mardin', lat: 37.3212, lng: 40.7245 },
    { id: 48, name: 'Muğla', code: 'mugla', lat: 37.2153, lng: 28.3636 },
    { id: 49, name: 'Muş', code: 'mus', lat: 38.9462, lng: 41.7539 },
    { id: 50, name: 'Nevşehir', code: 'nevsehir', lat: 38.6939, lng: 34.6857 },
    { id: 51, name: 'Niğde', code: 'nigde', lat: 37.9667, lng: 34.6833 },
    { id: 52, name: 'Ordu', code: 'ordu', lat: 40.9839, lng: 37.8764 },
    { id: 53, name: 'Rize', code: 'rize', lat: 41.0201, lng: 40.5234 },
    { id: 54, name: 'Sakarya', code: 'sakarya', lat: 40.7889, lng: 30.4053 },
    { id: 55, name: 'Samsun', code: 'samsun', lat: 41.2928, lng: 36.3313 },
    { id: 56, name: 'Siirt', code: 'siirt', lat: 37.9274, lng: 41.9403 },
    { id: 57, name: 'Sinop', code: 'sinop', lat: 42.0231, lng: 35.1531 },
    { id: 58, name: 'Sivas', code: 'sivas', lat: 39.7477, lng: 37.0179 },
    { id: 59, name: 'Tekirdağ', code: 'tekirdag', lat: 40.9833, lng: 27.5167 },
    { id: 60, name: 'Tokat', code: 'tokat', lat: 40.3167, lng: 36.5500 },
    { id: 61, name: 'Trabzon', code: 'trabzon', lat: 41.0015, lng: 39.7178 },
    { id: 62, name: 'Tunceli', code: 'tunceli', lat: 39.1079, lng: 39.5401 },
    { id: 63, name: 'Şanlıurfa', code: 'sanliurfa', lat: 37.1591, lng: 38.7969 },
    { id: 64, name: 'Uşak', code: 'usak', lat: 38.6823, lng: 29.4082 },
    { id: 65, name: 'Van', code: 'van', lat: 38.4891, lng: 43.4089 },
    { id: 66, name: 'Yozgat', code: 'yozgat', lat: 39.8181, lng: 34.8147 },
    { id: 67, name: 'Zonguldak', code: 'zonguldak', lat: 41.4564, lng: 31.7987 },
    { id: 68, name: 'Aksaray', code: 'aksaray', lat: 38.3687, lng: 34.0370 },
    { id: 69, name: 'Bayburt', code: 'bayburt', lat: 40.2552, lng: 40.2249 },
    { id: 70, name: 'Karaman', code: 'karaman', lat: 37.1759, lng: 33.2287 },
    { id: 71, name: 'Kırıkkale', code: 'kirikkale', lat: 39.8468, lng: 33.4988 },
    { id: 72, name: 'Batman', code: 'batman', lat: 37.8812, lng: 41.1351 },
    { id: 73, name: 'Şırnak', code: 'sirnak', lat: 37.4187, lng: 42.4918 },
    { id: 74, name: 'Bartın', code: 'bartin', lat: 41.6344, lng: 32.3375 },
    { id: 75, name: 'Ardahan', code: 'ardahan', lat: 41.1105, lng: 42.7022 },
    { id: 76, name: 'Iğdır', code: 'igdir', lat: 39.9200, lng: 44.0048 },
    { id: 77, name: 'Yalova', code: 'yalova', lat: 40.6565, lng: 29.2846 },
    { id: 78, name: 'Karabük', code: 'karabuk', lat: 41.2061, lng: 32.6204 },
    { id: 79, name: 'Kilis', code: 'kilis', lat: 36.7184, lng: 37.1212 },
    { id: 80, name: 'Osmaniye', code: 'osmaniye', lat: 37.0742, lng: 36.2478 },
    { id: 81, name: 'Düzce', code: 'duzce', lat: 40.8438, lng: 31.1565 },
  ];

  let nearest = null;
  let minDistance = Infinity;

  allCities.forEach(city => {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  });



  return nearest;
};

const Navigation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => { 
      try {
        // Redux state'lerini yükle
        dispatch(fetchStorage());
        dispatch(fetchFavorites());
        dispatch(fetchCurrentIndex());
        dispatch(fetchFontSize());
        dispatch(hydrateSavedContent());
        dispatch(hydrateContentPrefs());
        
        // Bildirim izni iste
        const hasPermission = await PrayerNotificationService.requestPermissions();
        dispatch(setNotificationPermission(hasPermission));
        
        // Konum izni iste ve şehir tespit et
        let selectedCity = { id: 34, name: 'İstanbul', code: 'istanbul' }; // Varsayılan
        
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          
          if (status === 'granted') {
            
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });

            const { latitude, longitude } = location.coords;
            

            
            // En yakın şehri bul
            const nearestCity = findNearestCity(latitude, longitude);
            
            if (nearestCity) {
              selectedCity = nearestCity;
            } else {
            }
          } else {
          }
        } catch (locationError) {
        }
        
        // Tespit edilen şehri Redux'a kaydet
        dispatch(setSelectedCity(selectedCity));
        
        // İlk yüklemede namaz vakitlerini getir
        const prayerTimesResult = await dispatch(fetchPrayerTimes(selectedCity.name));
        
            // Bildirimleri planla
            if (hasPermission && prayerTimesResult.payload) {
              await PrayerNotificationService.schedulePrayerNotifications(
                prayerTimesResult.payload,
                selectedCity.name
              );
              
              // Background task'ı kaydet ve başlat
              await BackgroundTaskService.registerBackgroundTask();
              await BackgroundTaskService.startBackgroundTask();
            }
      } catch (error) {
        console.log('❌ Uygulama başlatma hatası:', error);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Deep-link: handle daily-verse notification taps (cold start + warm).
  useEffect(() => {
    let mounted = true;
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (mounted && response) handleNotificationResponse(response);
    });
    const sub = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="BottomTabs" component={BottomTabs} />
        <RootStack.Screen name="MainStack" component={MainStack} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
