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
import { useDispatch } from 'react-redux';
import { setSelectedCity as setSelectedCityAction } from '../../redux/CounterSlice';
import { useExploreTheme } from '../../utils/Theme/ExploreTheme';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import * as Location from 'expo-location';

const turkishCities = [
  { id: 1, name: 'Adana', code: 'adana' }, { id: 2, name: 'Adıyaman', code: 'adiyaman' }, { id: 3, name: 'Afyonkarahisar', code: 'afyonkarahisar' }, { id: 4, name: 'Ağrı', code: 'agri' }, { id: 5, name: 'Amasya', code: 'amasya' }, { id: 6, name: 'Ankara', code: 'ankara' }, { id: 7, name: 'Antalya', code: 'antalya' }, { id: 8, name: 'Artvin', code: 'artvin' }, { id: 9, name: 'Aydın', code: 'aydin' }, { id: 10, name: 'Balıkesir', code: 'balikesir' }, { id: 11, name: 'Bilecik', code: 'bilecik' }, { id: 12, name: 'Bingöl', code: 'bingol' }, { id: 13, name: 'Bitlis', code: 'bitlis' }, { id: 14, name: 'Bolu', code: 'bolu' }, { id: 15, name: 'Burdur', code: 'burdur' }, { id: 16, name: 'Bursa', code: 'bursa' }, { id: 17, name: 'Çanakkale', code: 'canakkale' }, { id: 18, name: 'Çankırı', code: 'cankiri' }, { id: 19, name: 'Çorum', code: 'corum' }, { id: 20, name: 'Denizli', code: 'denizli' }, { id: 21, name: 'Diyarbakır', code: 'diyarbakir' }, { id: 22, name: 'Edirne', code: 'edirne' }, { id: 23, name: 'Elazığ', code: 'elazig' }, { id: 24, name: 'Erzincan', code: 'erzincan' }, { id: 25, name: 'Erzurum', code: 'erzurum' }, { id: 26, name: 'Eskişehir', code: 'eskisehir' }, { id: 27, name: 'Gaziantep', code: 'gaziantep' }, { id: 28, name: 'Giresun', code: 'giresun' }, { id: 29, name: 'Gümüşhane', code: 'gumushane' }, { id: 30, name: 'Hakkâri', code: 'hakkari' }, { id: 31, name: 'Hatay', code: 'hatay' }, { id: 32, name: 'Isparta', code: 'isparta' }, { id: 33, name: 'Mersin', code: 'mersin' }, { id: 34, name: 'İstanbul', code: 'istanbul' }, { id: 35, name: 'İzmir', code: 'izmir' }, { id: 36, name: 'Kars', code: 'kars' }, { id: 37, name: 'Kastamonu', code: 'kastamonu' }, { id: 38, name: 'Kayseri', code: 'kayseri' }, { id: 39, name: 'Kırklareli', code: 'kirklareli' }, { id: 40, name: 'Kırşehir', code: 'kirsehir' }, { id: 41, name: 'Kocaeli', code: 'kocaeli' }, { id: 42, name: 'Konya', code: 'konya' }, { id: 43, name: 'Kütahya', code: 'kutahya' }, { id: 44, name: 'Malatya', code: 'malatya' }, { id: 45, name: 'Manisa', code: 'manisa' }, { id: 46, name: 'Kahramanmaraş', code: 'kahramanmaras' }, { id: 47, name: 'Mardin', code: 'mardin' }, { id: 48, name: 'Muğla', code: 'mugla' }, { id: 49, name: 'Muş', code: 'mus' }, { id: 50, name: 'Nevşehir', code: 'nevsehir' }, { id: 51, name: 'Niğde', code: 'nigde' }, { id: 52, name: 'Ordu', code: 'ordu' }, { id: 53, name: 'Rize', code: 'rize' }, { id: 54, name: 'Sakarya', code: 'sakarya' }, { id: 55, name: 'Samsun', code: 'samsun' }, { id: 56, name: 'Siirt', code: 'siirt' }, { id: 57, name: 'Sinop', code: 'sinop' }, { id: 58, name: 'Sivas', code: 'sivas' }, { id: 59, name: 'Tekirdağ', code: 'tekirdag' }, { id: 60, name: 'Tokat', code: 'tokat' }, { id: 61, name: 'Trabzon', code: 'trabzon' }, { id: 62, name: 'Tunceli', code: 'tunceli' }, { id: 63, name: 'Şanlıurfa', code: 'sanliurfa' }, { id: 64, name: 'Uşak', code: 'usak' }, { id: 65, name: 'Van', code: 'van' }, { id: 66, name: 'Yozgat', code: 'yozgat' }, { id: 67, name: 'Zonguldak', code: 'zonguldak' }, { id: 68, name: 'Aksaray', code: 'aksaray' }, { id: 69, name: 'Bayburt', code: 'bayburt' }, { id: 70, name: 'Karaman', code: 'karaman' }, { id: 71, name: 'Kırıkkale', code: 'kirikkale' }, { id: 72, name: 'Batman', code: 'batman' }, { id: 73, name: 'Şırnak', code: 'sirnak' }, { id: 74, name: 'Bartın', code: 'bartin' }, { id: 75, name: 'Ardahan', code: 'ardahan' }, { id: 76, name: 'Iğdır', code: 'igdir' }, { id: 77, name: 'Yalova', code: 'yalova' }, { id: 78, name: 'Karabük', code: 'karabuk' }, { id: 79, name: 'Kilis', code: 'kilis' }, { id: 80, name: 'Osmaniye', code: 'osmaniye' }, { id: 81, name: 'Düzce', code: 'duzce' },
];

const cityCoords = {
  1: [37.0, 35.3213], 2: [37.7636, 38.2786], 3: [38.7507, 30.5567], 4: [39.7191, 43.0503], 5: [40.6499, 35.8353], 6: [39.9334, 32.8597], 7: [36.8969, 30.7133], 8: [41.1828, 41.8183], 9: [37.856, 27.8416], 10: [39.6484, 27.8826], 11: [40.1425, 29.9793], 12: [38.8847, 40.4982], 13: [38.3938, 42.1232], 14: [40.7316, 31.5895], 15: [37.7206, 30.2906], 16: [40.1826, 29.0665], 17: [40.1553, 26.4142], 18: [40.6013, 33.6134], 19: [40.5506, 34.9556], 20: [37.7765, 29.0864], 21: [37.9144, 40.2306], 22: [41.6771, 26.5557], 23: [38.681, 39.2264], 24: [39.75, 39.5], 25: [39.9334, 41.2756], 26: [39.7767, 30.5206], 27: [37.0662, 37.3833], 28: [40.9128, 38.3895], 29: [40.4603, 39.5086], 30: [37.5833, 43.7333], 31: [36.4018, 36.3498], 32: [37.7648, 30.5566], 33: [36.8, 34.6333], 34: [41.0082, 28.9784], 35: [38.4192, 27.1287], 36: [40.6013, 43.0975], 37: [41.3887, 33.7827], 38: [38.7312, 35.4787], 39: [41.735, 27.2256], 40: [39.1425, 34.1709], 41: [40.8533, 29.8815], 42: [37.8746, 32.4932], 43: [39.4189, 29.9833], 44: [38.3552, 38.3095], 45: [38.6191, 27.4289], 46: [37.5858, 36.9371], 47: [37.3212, 40.7245], 48: [37.2153, 28.3636], 49: [38.9462, 41.7539], 50: [38.6939, 34.6857], 51: [37.9667, 34.6833], 52: [40.9839, 37.8764], 53: [41.0201, 40.5234], 54: [40.7889, 30.4053], 55: [41.2928, 36.3313], 56: [37.9274, 41.9403], 57: [42.0231, 35.1531], 58: [39.7477, 37.0179], 59: [40.9833, 27.5167], 60: [40.3167, 36.55], 61: [41.0015, 39.7178], 62: [39.1079, 39.5401], 63: [37.1591, 38.7969], 64: [38.6823, 29.4082], 65: [38.4891, 43.4089], 66: [39.8181, 34.8147], 67: [41.4564, 31.7987], 68: [38.3687, 34.037], 69: [40.2552, 40.2249], 70: [37.1759, 33.2287], 71: [39.8468, 33.4988], 72: [37.8812, 41.1351], 73: [37.4187, 42.4918], 74: [41.6344, 32.3375], 75: [41.1105, 42.7022], 76: [39.92, 44.0048], 77: [40.6565, 29.2846], 78: [41.2061, 32.6204], 79: [36.7184, 37.1212], 80: [37.0742, 36.2478], 81: [40.8438, 31.1565],
};

const findNearestCity = (lat, lng) => {
  let nearest = null;
  let minDistance = Infinity;
  turkishCities.forEach((city) => {
    const coords = cityCoords[city.id];
    if (!coords) return;
    const distance = Math.sqrt(Math.pow(coords[0] - lat, 2) + Math.pow(coords[1] - lng, 2));
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...city, lat: coords[0], lng: coords[1] };
    }
  });
  return nearest;
};

const CitySelection = ({ navigation }) => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  const dispatch = useDispatch();
  const [filteredCities, setFilteredCities] = useState(turkishCities);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    setFilteredCities(turkishCities);
    setLoading(false);
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const defaultCity = { id: 34, name: 'İstanbul', code: 'istanbul' };
        dispatch(setSelectedCityAction(defaultCity));
        Alert.alert(t('LOCATION_PERMISSION_DENIED'), t('LOCATION_PERMISSION_DENIED_MESSAGE'), [{ text: t('OK') }]);
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;
      const nearestCity = findNearestCity(latitude, longitude);
      if (nearestCity) {
        dispatch(setSelectedCityAction(nearestCity));
        setSelectedCity(nearestCity);
        Alert.alert(t('LOCATION_DETECTED'), `${t('LOCATION_DETECTED_MESSAGE')} ${nearestCity.name}`, [{ text: t('OK') }]);
      } else {
        const defaultCity = { id: 34, name: 'İstanbul', code: 'istanbul' };
        dispatch(setSelectedCityAction(defaultCity));
        Alert.alert(t('LOCATION_ERROR'), t('LOCATION_ERROR_MESSAGE'), [{ text: t('OK') }]);
      }
    } catch (error) {
      const defaultCity = { id: 34, name: 'İstanbul', code: 'istanbul' };
      dispatch(setSelectedCityAction(defaultCity));
      Alert.alert(t('LOCATION_ERROR'), t('LOCATION_ERROR_MESSAGE'), [{ text: t('OK') }]);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredCities(turkishCities);
    } else {
      setFilteredCities(turkishCities.filter((city) => city.name.toLowerCase().includes(text.toLowerCase())));
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    dispatch(setSelectedCityAction(city));
    Alert.alert(t('CITY_SELECTED'), `${city.name} ${t('CITY_SELECTED_MESSAGE')}`, [
      { text: t('OK'), onPress: () => navigation.goBack() },
    ]);
  };

  const renderCity = ({ item }) => {
    const on = selectedCity?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.cityItem, { backgroundColor: on ? c.goldSoft : c.card, borderColor: on ? c.gold : c.line }]}
        onPress={() => handleCitySelect(item)}
      >
        <Text style={[styles.cityName, { color: on ? c.goldInk : c.ink, fontFamily: fonts.ui, fontWeight: on ? '700' : '500' }]}>
          {item.name}
        </Text>
        {on && <MaterialIcons name="check" size={22} color={c.gold} />}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: c.bg }]}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={c.gold} />
          <Text style={[styles.loadingText, { color: c.inkSoft, fontFamily: fonts.ui }]}>{t('CITIES_LOADING')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: c.surface, borderColor: c.line }]}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={20} color={c.ink} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.ink, fontFamily: fonts.display }]}>{t('CITY_SELECTION')}</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: c.surface, borderColor: c.line }]}>
        <Feather name="search" size={18} color={c.muted} />
        <TextInput
          style={[styles.searchInput, { color: c.ink, fontFamily: fonts.ui }]}
          placeholder={t('CITY_SEARCH_PLACEHOLDER')}
          placeholderTextColor={c.muted}
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Feather name="x" size={18} color={c.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Use my location */}
      <TouchableOpacity style={[styles.locBtn, { backgroundColor: c.goldSoft }]} onPress={getCurrentLocation}>
        <Feather name="navigation" size={16} color={c.goldInk} />
        <Text style={[styles.locBtnText, { color: c.goldInk, fontFamily: fonts.ui }]}>{t('USE_MY_LOCATION')}</Text>
      </TouchableOpacity>

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
  container: { flex: 1 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  loadingText: { fontSize: 16, marginTop: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  backButton: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '700' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginTop: 6,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  locBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 12, paddingVertical: 12, borderRadius: 14,
  },
  locBtnText: { fontSize: 14, fontWeight: '700' },
  citiesList: { flex: 1, marginTop: 12 },
  citiesListContent: { paddingHorizontal: 20, paddingBottom: 20 },
  cityItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 18, marginBottom: 8, borderRadius: 14, borderWidth: 1,
  },
  cityName: { fontSize: 15 },
});

export default CitySelection;
