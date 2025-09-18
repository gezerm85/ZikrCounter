import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCity } from '../../redux/CounterSlice';
import { fixedColors } from '../../utils/Theme/VectorTheme';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';

const CitySelection = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);

  // 81 il listesi
  const turkishCities = [
    { id: 1, name: 'Adana', code: 'adana' },
    { id: 2, name: 'Adıyaman', code: 'adiyaman' },
    { id: 3, name: 'Afyonkarahisar', code: 'afyonkarahisar' },
    { id: 4, name: 'Ağrı', code: 'agri' },
    { id: 5, name: 'Amasya', code: 'amasya' },
    { id: 6, name: 'Ankara', code: 'ankara' },
    { id: 7, name: 'Antalya', code: 'antalya' },
    { id: 8, name: 'Artvin', code: 'artvin' },
    { id: 9, name: 'Aydın', code: 'aydin' },
    { id: 10, name: 'Balıkesir', code: 'balikesir' },
    { id: 11, name: 'Bilecik', code: 'bilecik' },
    { id: 12, name: 'Bingöl', code: 'bingol' },
    { id: 13, name: 'Bitlis', code: 'bitlis' },
    { id: 14, name: 'Bolu', code: 'bolu' },
    { id: 15, name: 'Burdur', code: 'burdur' },
    { id: 16, name: 'Bursa', code: 'bursa' },
    { id: 17, name: 'Çanakkale', code: 'canakkale' },
    { id: 18, name: 'Çankırı', code: 'cankiri' },
    { id: 19, name: 'Çorum', code: 'corum' },
    { id: 20, name: 'Denizli', code: 'denizli' },
    { id: 21, name: 'Diyarbakır', code: 'diyarbakir' },
    { id: 22, name: 'Edirne', code: 'edirne' },
    { id: 23, name: 'Elazığ', code: 'elazig' },
    { id: 24, name: 'Erzincan', code: 'erzincan' },
    { id: 25, name: 'Erzurum', code: 'erzurum' },
    { id: 26, name: 'Eskişehir', code: 'eskisehir' },
    { id: 27, name: 'Gaziantep', code: 'gaziantep' },
    { id: 28, name: 'Giresun', code: 'giresun' },
    { id: 29, name: 'Gümüşhane', code: 'gumushane' },
    { id: 30, name: 'Hakkâri', code: 'hakkari' },
    { id: 31, name: 'Hatay', code: 'hatay' },
    { id: 32, name: 'Isparta', code: 'isparta' },
    { id: 33, name: 'Mersin', code: 'mersin' },
    { id: 34, name: 'İstanbul', code: 'istanbul' },
    { id: 35, name: 'İzmir', code: 'izmir' },
    { id: 36, name: 'Kars', code: 'kars' },
    { id: 37, name: 'Kastamonu', code: 'kastamonu' },
    { id: 38, name: 'Kayseri', code: 'kayseri' },
    { id: 39, name: 'Kırklareli', code: 'kirklareli' },
    { id: 40, name: 'Kırşehir', code: 'kirsehir' },
    { id: 41, name: 'Kocaeli', code: 'kocaeli' },
    { id: 42, name: 'Konya', code: 'konya' },
    { id: 43, name: 'Kütahya', code: 'kutahya' },
    { id: 44, name: 'Malatya', code: 'malatya' },
    { id: 45, name: 'Manisa', code: 'manisa' },
    { id: 46, name: 'Kahramanmaraş', code: 'kahramanmaras' },
    { id: 47, name: 'Mardin', code: 'mardin' },
    { id: 48, name: 'Muğla', code: 'mugla' },
    { id: 49, name: 'Muş', code: 'mus' },
    { id: 50, name: 'Nevşehir', code: 'nevsehir' },
    { id: 51, name: 'Niğde', code: 'nigde' },
    { id: 52, name: 'Ordu', code: 'ordu' },
    { id: 53, name: 'Rize', code: 'rize' },
    { id: 54, name: 'Sakarya', code: 'sakarya' },
    { id: 55, name: 'Samsun', code: 'samsun' },
    { id: 56, name: 'Siirt', code: 'siirt' },
    { id: 57, name: 'Sinop', code: 'sinop' },
    { id: 58, name: 'Sivas', code: 'sivas' },
    { id: 59, name: 'Tekirdağ', code: 'tekirdag' },
    { id: 60, name: 'Tokat', code: 'tokat' },
    { id: 61, name: 'Trabzon', code: 'trabzon' },
    { id: 62, name: 'Tunceli', code: 'tunceli' },
    { id: 63, name: 'Şanlıurfa', code: 'sanliurfa' },
    { id: 64, name: 'Uşak', code: 'usak' },
    { id: 65, name: 'Van', code: 'van' },
    { id: 66, name: 'Yozgat', code: 'yozgat' },
    { id: 67, name: 'Zonguldak', code: 'zonguldak' },
    { id: 68, name: 'Aksaray', code: 'aksaray' },
    { id: 69, name: 'Bayburt', code: 'bayburt' },
    { id: 70, name: 'Karaman', code: 'karaman' },
    { id: 71, name: 'Kırıkkale', code: 'kirikkale' },
    { id: 72, name: 'Batman', code: 'batman' },
    { id: 73, name: 'Şırnak', code: 'sirnak' },
    { id: 74, name: 'Bartın', code: 'bartin' },
    { id: 75, name: 'Ardahan', code: 'ardahan' },
    { id: 76, name: 'Iğdır', code: 'igdir' },
    { id: 77, name: 'Yalova', code: 'yalova' },
    { id: 78, name: 'Karabük', code: 'karabuk' },
    { id: 79, name: 'Kilis', code: 'kilis' },
    { id: 80, name: 'Osmaniye', code: 'osmaniye' },
    { id: 81, name: 'Düzce', code: 'duzce' },
  ];

  useEffect(() => {
    setCities(turkishCities);
    setFilteredCities(turkishCities);
    setLoading(false);
  }, []);

  const getCurrentLocation = async () => {
    try {
      // Konum izni iste
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // İzin verilmezse varsayılan şehir
        console.log('❌ Konum izni verilmedi, varsayılan şehir seçiliyor: İstanbul');
        const defaultCity = { id: 34, name: 'İstanbul', code: 'istanbul' };
        dispatch(setSelectedCity(defaultCity));
        
        Alert.alert(
          t("LOCATION_PERMISSION_DENIED"),
          t("LOCATION_PERMISSION_DENIED_MESSAGE"),
          [{ text: t("OK") }]
        );
        return;
      }

      // Mevcut konumu al
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      
      // En yakın şehri bul
      const nearestCity = findNearestCity(latitude, longitude);
      

      
      if (nearestCity) {
        dispatch(setSelectedCity(nearestCity));
        
        
        Alert.alert(
          t("LOCATION_DETECTED"),
          `${t("LOCATION_DETECTED_MESSAGE")} ${nearestCity.name}`,
          [{ text: t("OK") }]
        );
      } else {
        // Şehir bulunamazsa varsayılan
        console.log('❌ Şehir bulunamadı, varsayılan şehir seçiliyor: İstanbul');
        const defaultCity = { id: 34, name: 'İstanbul', code: 'istanbul' };
        dispatch(setSelectedCity(defaultCity));
        
        Alert.alert(
          t("LOCATION_ERROR"),
          t("LOCATION_ERROR_MESSAGE"),
          [{ text: t("OK") }]
        );
      }
    } catch (error) {
      console.log('❌ Konum alınamadı, hata:', error);
      console.log('Varsayılan şehir seçiliyor: İstanbul');
      
      // Hata durumunda varsayılan şehir
      const defaultCity = { id: 34, name: 'İstanbul', code: 'istanbul' };
      dispatch(setSelectedCity(defaultCity));
      
      Alert.alert(
        t("LOCATION_ERROR"),
        t("LOCATION_ERROR_MESSAGE"),
        [{ text: t("OK") }]
      );
    }
  };

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

    console.log('🔍 En yakın şehir arama sonucu:');
    console.log('En yakın şehir:', nearest);
    console.log('Minimum mesafe:', minDistance);

    return nearest;
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    // Redux'a kaydet
    dispatch({ type: 'counter/setSelectedCity', payload: city });
    
    Alert.alert(
      t("CITY_SELECTED"),
      `${city.name} ${t("CITY_SELECTED_MESSAGE")}`,
      [
        {
          text: t("OK"),
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderCity = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.cityItem,
        selectedCity?.id === item.id && styles.selectedCityItem,
      ]}
      onPress={() => handleCitySelect(item)}
    >
      <Text
        style={[
          styles.cityName,
          selectedCity?.id === item.id && styles.selectedCityName,
        ]}
      >
        {item.name}
      </Text>
      {selectedCity?.id === item.id && (
        <MaterialIcons name="check" size={24} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: fixedColors.bgColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>{t("CITIES_LOADING")}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: fixedColors.bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("CITY_SELECTION")}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder={t("CITY_SEARCH_PLACEHOLDER")}
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <MaterialIcons name="clear" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Selected City Info */}
      {selectedCity && (
        <View style={styles.selectedCityInfo}>
          <MaterialIcons name="location-on" size={20} color="#007AFF" />
          <Text style={styles.selectedCityText}>
            {t("SELECTED_CITY")}: {selectedCity.name}
          </Text>
        </View>
      )}

      {/* Cities List */}
      <FlatList
        data={filteredCities}
        renderItem={renderCity}
        keyExtractor={(item) => item.id.toString()}
        style={styles.citiesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.citiesListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'OpenSans',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'OpenSans',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'OpenSans',
  },
  selectedCityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  selectedCityText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'OpenSans',
    fontWeight: '600',
  },
  citiesList: {
    flex: 1,
  },
  citiesListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  selectedCityItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.5)',
  },
  cityName: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'OpenSans',
    fontWeight: '500',
  },
  selectedCityName: {
    color: '#007AFF',
    fontWeight: '700',
  },
});

export default CitySelection;
