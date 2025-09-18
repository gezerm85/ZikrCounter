import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fixedColors } from '../../utils/Theme/VectorTheme';
import { fetchPrayerTimes } from '../../redux/CounterSlice';
import PrayerNotificationService from '../../services/PrayerNotificationService';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment-timezone';
import AdBanner from '../../components/AdBanner/AdBanner';
import InterstitialAd from '../../components/InterstitialAd/InterstitialAd';
import CustomHeader from '../../components/CustomHeader/CustomHeader';

const { width } = Dimensions.get('window');

const PrayerTimes = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedCity, prayerTimes, prayerTimesLoading, prayerTimesError, notificationPermission } = useSelector((state) => state.counter);
  
  const [refreshing, setRefreshing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [nextPrayer, setNextPrayer] = useState(null);
  
  // Reklam için click count state'i
  const [clickCounts, setClickCounts] = useState({
    button1: 0,
    button2: 0,
    button3: 0,
    button4: 0,
  });

  const thresholds = {
    button1: 10,
    button2: 15,
    button3: 25,
    button4: 100,
  };

  const handleButtonClick = (buttonKey) => {
    setClickCounts((prevCounts) => {
      const newCount = prevCounts[buttonKey] + 1;
      return { ...prevCounts, [buttonKey]: newCount };
    });
  };

  const resetClickCount = (buttonKey) => {
    setClickCounts((prevCounts) => ({ ...prevCounts, [buttonKey]: 0 }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const cityName = selectedCity?.name || 'Istanbul';
    await dispatch(fetchPrayerTimes(cityName));
    setRefreshing(false);
  };

  useEffect(() => {
    // selectedCity değiştiğinde API isteği at
    if (selectedCity) {
      const cityName = selectedCity.name || 'Istanbul';
      const updatePrayerTimes = async () => {
        const result = await dispatch(fetchPrayerTimes(cityName));
        
        // Bildirimleri güncelle
        if (notificationPermission && result.payload) {
          await PrayerNotificationService.schedulePrayerNotifications(
            result.payload,
            selectedCity.name
          );
        }
      };
      
      updatePrayerTimes();
    }
  }, [selectedCity, dispatch, notificationPermission]);

  // Geri sayım hesaplama
  useEffect(() => {
    if (!prayerTimes) return;

    const updateCountdown = () => {
      const now = moment().tz('Europe/Istanbul');
      const today = now.format('YYYY-MM-DD');
      
      
      const prayers = [
        { key: 'Fajr', time: prayerTimes.timings.Fajr },
        { key: 'Sunrise', time: prayerTimes.timings.Sunrise },
        { key: 'Dhuhr', time: prayerTimes.timings.Dhuhr },
        { key: 'Asr', time: prayerTimes.timings.Asr },
        { key: 'Maghrib', time: prayerTimes.timings.Maghrib },
        { key: 'Isha', time: prayerTimes.timings.Isha },
      ];

      let foundNext = null;
      let minDiff = moment.duration(Infinity);
      const remaining = {};

      for (let i = 0; i < prayers.length; i++) {
        const prayer = prayers[i];
        const prayerTime = moment.tz(`${today} ${prayer.time}`, 'Europe/Istanbul');
        const diff = moment.duration(prayerTime.diff(now));


        if (diff.asMilliseconds() > 0) {
          const hours = Math.floor(diff.asHours());
          const minutes = diff.minutes();
          const seconds = diff.seconds();
          
          remaining[prayer.key] = {
            hours,
            minutes,
            seconds,
            total: diff.asMilliseconds()
          };

          if (diff.asMilliseconds() < minDiff.asMilliseconds()) {
            minDiff = diff;
            foundNext = prayer;
          }
        } else {
          remaining[prayer.key] = null;
        }
      }

      // Eğer bugün için namaz bulunamazsa, yarının sabah namazını kontrol et
      if (!foundNext) {
        const tomorrow = now.clone().add(1, 'day').format('YYYY-MM-DD');
        const fajrTomorrow = moment.tz(`${tomorrow} ${prayerTimes.timings.Fajr}`, 'Europe/Istanbul');
        const diff = moment.duration(fajrTomorrow.diff(now));
        
        
        if (diff.asMilliseconds() > 0) {
          const hours = Math.floor(diff.asHours());
          const minutes = diff.minutes();
          const seconds = diff.seconds();
          
          remaining['Fajr'] = {
            hours,
            minutes,
            seconds,
            total: diff.asMilliseconds()
          };
          foundNext = { key: 'Fajr', time: prayerTimes.timings.Fajr };
        }
      }

      setTimeRemaining(remaining);
      setNextPrayer(foundNext);
      
      // Debug için
   
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const onRefresh = () => {
    handleRefresh();
  };

  const formatTime = (time) => {
    return time || '--:--';
  };

  const formatCountdown = (remaining) => {
    if (!remaining) return t("PASSED");
    
    const { hours, minutes, seconds } = remaining;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (seconds > 0) {
      return `00:${seconds.toString().padStart(2, '0')}`;
    } else {
      return t("PASSED");
    }
  };

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
      { name: 'Fajr', time: prayerTimes.timings.Fajr, icon: 'wb-twilight' },
      { name: 'Sunrise', time: prayerTimes.timings.Sunrise, icon: 'wb-sunny' },
      { name: 'Dhuhr', time: prayerTimes.timings.Dhuhr, icon: 'wb-sunny' },
      { name: 'Asr', time: prayerTimes.timings.Asr, icon: 'wb-sunny' },
      { name: 'Maghrib', time: prayerTimes.timings.Maghrib, icon: 'wb-sunny' },
      { name: 'Isha', time: prayerTimes.timings.Isha, icon: 'nights-stay' },
    ];

    for (let i = 0; i < prayers.length; i++) {
      const prayer = prayers[i];
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (currentTime < prayerTime) {
        return prayer;
      }
    }
    
    return prayers[0]; // Next day's Fajr
  };

  const getPrayerName = (prayerKey) => {
    const prayerNames = {
      Fajr: t("FAJR"),
      Sunrise: t("SUNRISE"),
      Dhuhr: t("DHUHR"),
      Asr: t("ASR"),
      Maghrib: t("MAGHRIB"),
      Isha: t("ISHA"),
    };
    return prayerNames[prayerKey] || prayerKey;
  };

  const getPrayerIcon = (prayerKey) => {
    const prayerIcons = {
      Fajr: 'wb-twilight',
      Sunrise: 'wb-sunny',
      Dhuhr: 'wb-sunny',
      Asr: 'wb-sunny',
      Maghrib: 'wb-sunny',
      Isha: 'nights-stay',
    };
    return prayerIcons[prayerKey] || 'schedule';
  };

  if (prayerTimesLoading) {
    return (
      <View style={[styles.container, { backgroundColor: fixedColors.bgColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>{t("PRAYER_TIMES_LOADING")}</Text>
        </View>
      </View>
    );
  }

  if (prayerTimesError) {
    return (
      <View style={[styles.container, { backgroundColor: fixedColors.bgColor }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#fff" />
          <Text style={styles.errorText}>{t("PRAYER_TIMES_ERROR")}</Text>
          <Text style={styles.retryText} onPress={onRefresh}>
            {t("RETRY")}
          </Text>
        </View>
      </View>
    );
  }

  const currentPrayer = getCurrentPrayer();

  return (
    <View style={[styles.container, { backgroundColor: fixedColors.bgColor }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
      {/* Header */}
      <CustomHeader 
        title={t("PRAYER_TIMES")} 
        subtitle={`${prayerTimes?.date?.readable} - ${prayerTimes?.date?.hijri?.date}`} 
      />

      {/* Next Prayer Highlight */}
      {nextPrayer && (
        <View style={styles.currentPrayerCard}>
          <View style={styles.currentPrayerIcon}>
            <MaterialIcons name={getPrayerIcon(nextPrayer.key)} size={32} color="#fff" />
          </View>
          <View style={styles.currentPrayerInfo}>
            <Text style={styles.currentPrayerLabel}>{t("NEXT_PRAYER")}</Text>
            <Text style={styles.currentPrayerName}>{getPrayerName(nextPrayer.key)}</Text>
            <Text style={styles.currentPrayerTime}>{formatTime(nextPrayer.time)}</Text>
            <Text style={styles.countdownText}>
              {formatCountdown(timeRemaining[nextPrayer.key])} {t("REMAINING")}
            </Text>
          </View>
        </View>
      )}

      {/* Prayer Times List */}
      <View style={styles.prayerList}>
        {prayerTimes?.timings && Object.entries(prayerTimes.timings).map(([key, time]) => {
          if (['Imsak', 'Midnight', 'Firstthird', 'Lastthird'].includes(key)) return null;
          
          const isNext = nextPrayer?.key === key;
          const remaining = timeRemaining[key];
          
          return (
            <View
              key={key}
              style={[
                styles.prayerItem,
                isNext && styles.currentPrayerItem,
              ]}
            >
              <View style={styles.prayerItemLeft}>
                <MaterialIcons
                  name={getPrayerIcon(key)}
                  size={24}
                  color={isNext ? '#fff' : '#666'}
                />
                <View style={styles.prayerItemInfo}>
                  <Text style={[
                    styles.prayerItemName,
                    isNext && styles.currentPrayerItemText
                  ]}>
                    {getPrayerName(key)}
                  </Text>
                  <Text style={[
                    styles.countdownText,
                    isNext && styles.currentCountdownText
                  ]}>
                    {formatCountdown(remaining)} {t("REMAINING")}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.prayerItemTime,
                isNext && styles.currentPrayerItemText
              ]}>
                {formatTime(time)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Location Info */}
      <View style={styles.locationCard}>
        <MaterialIcons name="location-on" size={20} color="#666" />
        <Text style={styles.locationText}>{selectedCity?.name || 'İstanbul'}, {t("TURKEY")}</Text>
      </View>
      </ScrollView>
      
      {/* Ad Banner */}
      <View style={styles.adContainer}>
        <AdBanner />
      </View>
      
      {/* Interstitial Ads */}
      {Object.keys(clickCounts).map((buttonKey) => (
        <InterstitialAd
          key={buttonKey}
          clickCount={clickCounts[buttonKey]}
          onAdClosed={() => resetClickCount(buttonKey)}
          adCouner={thresholds[buttonKey]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  adContainer: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'OpenSans',
  },
  retryText: {
    color: '#007AFF',
    fontSize: 16,
    marginTop: 8,
    textDecorationLine: 'underline',
    fontFamily: 'OpenSans',
  },
  currentPrayerCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',


  },
  currentPrayerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  currentPrayerInfo: {
    flex: 1,
  },
  currentPrayerLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'OpenSans',
    marginBottom: 4,
  },
  currentPrayerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'OpenSans',
    marginBottom: 4,
  },
  currentPrayerTime: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'OpenSans',
  },
  countdownText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'OpenSans',
    marginTop: 2,
  },
  currentCountdownText: {
    color: '#fff',
    fontWeight: '600',
  },
  prayerList: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  currentPrayerItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  prayerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prayerItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  prayerItemName: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'OpenSans',
    fontWeight: '500',
  },
  currentPrayerItemText: {
    color: '#fff',
    fontWeight: '700',
  },
  prayerItemTime: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'OpenSans',
    fontWeight: '600',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'OpenSans',
  },
});

export default PrayerTimes;
