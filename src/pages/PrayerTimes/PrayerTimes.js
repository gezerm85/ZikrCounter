import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useExploreTheme } from '../../utils/Theme/ExploreTheme';
import { fetchPrayerTimes } from '../../redux/CounterSlice';
import PrayerNotificationService from '../../services/PrayerNotificationService';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment-timezone';
import AdBanner from '../../components/AdBanner/AdBanner';
import InterstitialAd from '../../components/InterstitialAd/InterstitialAd';
import CustomHeader from '../../components/CustomHeader/CustomHeader';

const PrayerTimes = () => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  const dispatch = useDispatch();
  const { selectedCity, prayerTimes, prayerTimesLoading, prayerTimesError, notificationPermission } = useSelector((state) => state.counter);

  const [refreshing, setRefreshing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [nextPrayer, setNextPrayer] = useState(null);

  const [clickCounts, setClickCounts] = useState({ button1: 0, button2: 0, button3: 0, button4: 0 });
  const thresholds = { button1: 10, button2: 15, button3: 25, button4: 100 };

  const handleButtonClick = (buttonKey) => {
    setClickCounts((prev) => ({ ...prev, [buttonKey]: prev[buttonKey] + 1 }));
  };
  const resetClickCount = (buttonKey) => {
    setClickCounts((prev) => ({ ...prev, [buttonKey]: 0 }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const cityName = selectedCity?.name || 'Istanbul';
    await dispatch(fetchPrayerTimes(cityName));
    setRefreshing(false);
  };

  useEffect(() => {
    if (selectedCity) {
      const cityName = selectedCity.name || 'Istanbul';
      const updatePrayerTimes = async () => {
        const result = await dispatch(fetchPrayerTimes(cityName));
        if (notificationPermission && result.payload) {
          await PrayerNotificationService.schedulePrayerNotifications(result.payload, selectedCity.name);
        }
      };
      updatePrayerTimes();
    }
  }, [selectedCity, dispatch, notificationPermission]);

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
          remaining[prayer.key] = {
            hours: Math.floor(diff.asHours()),
            minutes: diff.minutes(),
            seconds: diff.seconds(),
            total: diff.asMilliseconds(),
          };
          if (diff.asMilliseconds() < minDiff.asMilliseconds()) {
            minDiff = diff;
            foundNext = prayer;
          }
        } else {
          remaining[prayer.key] = null;
        }
      }

      if (!foundNext) {
        const tomorrow = now.clone().add(1, 'day').format('YYYY-MM-DD');
        const fajrTomorrow = moment.tz(`${tomorrow} ${prayerTimes.timings.Fajr}`, 'Europe/Istanbul');
        const diff = moment.duration(fajrTomorrow.diff(now));
        if (diff.asMilliseconds() > 0) {
          remaining['Fajr'] = {
            hours: Math.floor(diff.asHours()),
            minutes: diff.minutes(),
            seconds: diff.seconds(),
            total: diff.asMilliseconds(),
          };
          foundNext = { key: 'Fajr', time: prayerTimes.timings.Fajr };
        }
      }

      setTimeRemaining(remaining);
      setNextPrayer(foundNext);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const onRefresh = () => handleRefresh();
  const formatTime = (time) => time || '--:--';

  const formatCountdown = (remaining) => {
    if (!remaining) return t('PASSED');
    const { hours, minutes, seconds } = remaining;
    if (hours > 0) return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (minutes > 0) return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (seconds > 0) return `00:${String(seconds).padStart(2, '0')}`;
    return t('PASSED');
  };

  const getPrayerName = (prayerKey) => {
    const names = { Fajr: t('FAJR'), Sunrise: t('SUNRISE'), Dhuhr: t('DHUHR'), Asr: t('ASR'), Maghrib: t('MAGHRIB'), Isha: t('ISHA') };
    return names[prayerKey] || prayerKey;
  };

  const getPrayerIcon = (prayerKey) => {
    const icons = { Fajr: 'wb-twilight', Sunrise: 'wb-sunny', Dhuhr: 'wb-sunny', Asr: 'wb-sunny', Maghrib: 'wb-sunny', Isha: 'nights-stay' };
    return icons[prayerKey] || 'schedule';
  };

  if (prayerTimesLoading) {
    return (
      <View style={[styles.container, { backgroundColor: c.bg }]}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={c.gold} />
          <Text style={[styles.stateText, { color: c.inkSoft, fontFamily: fonts.ui }]}>{t('PRAYER_TIMES_LOADING')}</Text>
        </View>
      </View>
    );
  }

  if (prayerTimesError) {
    return (
      <View style={[styles.container, { backgroundColor: c.bg }]}>
        <View style={styles.centerBox}>
          <MaterialIcons name="error-outline" size={48} color={c.muted} />
          <Text style={[styles.stateText, { color: c.inkSoft, fontFamily: fonts.ui }]}>{t('PRAYER_TIMES_ERROR')}</Text>
          <Text style={[styles.retryText, { color: c.gold, fontFamily: fonts.ui }]} onPress={onRefresh}>{t('RETRY')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.gold} />}
      >
        <CustomHeader
          title={t('PRAYER_TIMES')}
          subtitle={`${prayerTimes?.date?.readable || ''}${prayerTimes?.date?.hijri?.date ? ' · ' + prayerTimes.date.hijri.date : ''}`}
        />

        {/* Next prayer hero */}
        {nextPrayer && (
          <View style={[styles.hero, { backgroundColor: c.gold, shadowColor: c.gold }]}>
            <Text style={[styles.heroLabel, { color: c.onAcc, fontFamily: fonts.ui }]}>{t('NEXT_PRAYER')}</Text>
            <Text style={[styles.heroName, { color: c.onAcc, fontFamily: fonts.display }]}>{getPrayerName(nextPrayer.key)}</Text>
            <Text style={[styles.heroTime, { color: c.onAcc, fontFamily: fonts.mono }]}>{formatTime(nextPrayer.time)}</Text>
            <Text style={[styles.heroCountdown, { color: c.onAcc, fontFamily: fonts.mono }]}>
              {formatCountdown(timeRemaining[nextPrayer.key])} {t('REMAINING')}
            </Text>
          </View>
        )}

        {/* Prayer list */}
        <View style={[styles.prayerList, { backgroundColor: c.surface, borderColor: c.line }]}>
          {prayerTimes?.timings && Object.entries(prayerTimes.timings).map(([key, time], idx, arr) => {
            if (['Imsak', 'Midnight', 'Firstthird', 'Lastthird'].includes(key)) return null;
            const isNext = nextPrayer?.key === key;
            return (
              <View
                key={key}
                style={[
                  styles.prayerItem,
                  { borderBottomColor: c.line },
                  isNext && { backgroundColor: c.goldSoft },
                ]}
              >
                <View style={styles.prayerItemLeft}>
                  <MaterialIcons name={getPrayerIcon(key)} size={22} color={isNext ? c.gold : c.muted} />
                  <View style={styles.prayerItemInfo}>
                    <Text style={[styles.prayerItemName, { color: c.ink, fontFamily: fonts.ui }, isNext && { fontWeight: '700' }]}>
                      {getPrayerName(key)}
                    </Text>
                    <Text style={[styles.countdownText, { color: c.muted, fontFamily: fonts.mono }, isNext && { color: c.goldInk }]}>
                      {formatCountdown(timeRemaining[key])} {t('REMAINING')}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.prayerItemTime, { color: c.ink, fontFamily: fonts.mono }, isNext && { color: c.goldInk }]}>
                  {formatTime(time)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Location */}
        <View style={[styles.locationCard, { backgroundColor: c.card, borderColor: c.line }]}>
          <MaterialIcons name="location-on" size={18} color={c.gold} />
          <Text style={[styles.locationText, { color: c.inkSoft, fontFamily: fonts.ui }]}>
            {selectedCity?.name || 'İstanbul'}, {t('TURKEY')}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.adContainer}>
        <AdBanner />
      </View>

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
  container: { flex: 1 },
  scrollView: { flex: 1 },
  adContainer: { width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  stateText: { fontSize: 16, marginTop: 16, textAlign: 'center' },
  retryText: { fontSize: 15, marginTop: 10, fontWeight: '700' },
  hero: {
    marginHorizontal: 20,
    marginTop: 4,
    padding: 22,
    borderRadius: 24,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  heroLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, opacity: 0.9, textTransform: 'uppercase' },
  heroName: { fontSize: 34, fontWeight: '700', marginTop: 6 },
  heroTime: { fontSize: 26, fontWeight: '700', marginTop: 2 },
  heroCountdown: { fontSize: 15, marginTop: 8, opacity: 0.95 },
  prayerList: { marginHorizontal: 20, marginTop: 16, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  prayerItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  prayerItemInfo: { marginLeft: 12, flex: 1 },
  prayerItemName: { fontSize: 16, fontWeight: '500' },
  countdownText: { fontSize: 13, marginTop: 2 },
  prayerItemTime: { fontSize: 17, fontWeight: '600' },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  locationText: { fontSize: 14 },
});

export default PrayerTimes;
