import * as Notifications from 'expo-notifications';
import moment from 'moment';
import 'moment-timezone';

class PrayerNotificationService {
  static async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  static async schedulePrayerNotifications(prayerTimes, cityName = 'İstanbul') {
    try {
      // Önceki bildirimleri temizle
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (!prayerTimes || !prayerTimes.timings) {
        return;
      }

      const prayers = [
        { key: 'Fajr', name: 'Sabah', time: prayerTimes.timings.Fajr },
        { key: 'Dhuhr', name: 'Öğle', time: prayerTimes.timings.Dhuhr },
        { key: 'Asr', name: 'İkindi', time: prayerTimes.timings.Asr },
        { key: 'Maghrib', name: 'Akşam', time: prayerTimes.timings.Maghrib },
        { key: 'Isha', name: 'Yatsı', time: prayerTimes.timings.Isha },
      ];

      const today = moment().tz('Europe/Istanbul').format('YYYY-MM-DD');
      const tomorrow = moment().tz('Europe/Istanbul').add(1, 'day').format('YYYY-MM-DD');

      // Bugün ve yarın için bildirimleri planla
      for (const day of [today, tomorrow]) {
        for (const prayer of prayers) {
          const prayerTime = moment.tz(`${day} ${prayer.time}`, 'Europe/Istanbul');
          const now = moment().tz('Europe/Istanbul');

          // Sadece gelecekteki namazlar için bildirim planla
          if (prayerTime.isAfter(now)) {
            // 10 dakika önce bildirimi
            const reminderTime = prayerTime.clone().subtract(10, 'minutes');
            if (reminderTime.isAfter(now)) {
              await this.scheduleNotification({
                id: `prayer_reminder_${prayer.key}_${day}`,
                title: 'Namaz Vakti Yaklaşıyor',
                body: `${prayer.name} namazına 10 dakika kaldı (${cityName})`,
                trigger: { type: 'date', date: reminderTime.toDate() },
                data: {
                  type: 'prayer_reminder',
                  prayer: prayer.key,
                  city: cityName,
                },
              });
            }

            // Namaz vaktinde bildirimi
            await this.scheduleNotification({
              id: `prayer_time_${prayer.key}_${day}`,
              title: 'Namaz Vakti',
              body: `${prayer.name} namazı vakti geldi (${cityName})`,
              trigger: { type: 'date', date: prayerTime.toDate() },
              data: {
                type: 'prayer_time',
                prayer: prayer.key,
                city: cityName,
              },
            });
          }
        }
      }

    } catch (error) {
      console.error('Error scheduling prayer notifications:', error);
    }
  }

  static async scheduleNotification(notification) {
    try {
      const { id, title, body, trigger, data } = notification;
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: 'high',
          categoryIdentifier: 'prayer-notification',
        },
        trigger,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  }

  // Background task için namaz vakitlerini kontrol et
  static async checkAndSchedulePrayerNotifications() {
    try {
      // Mevcut şehir bilgisini al (AsyncStorage'dan)
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const selectedCityData = await AsyncStorage.getItem('selectedCity');
      
      if (selectedCityData) {
        const selectedCity = JSON.parse(selectedCityData);
        
        // Namaz vakitlerini API'den al
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity.name}&country=Turkey&method=2`
        );
        const data = await response.json();
        
        if (data.data) {
          await this.schedulePrayerNotifications(data.data, selectedCity.name);
          console.log('✅ Background namaz vakitleri güncellendi');
        }
      }
    } catch (error) {
      console.error('❌ Background namaz vakitleri hatası:', error);
    }
  }

  static async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}

export default PrayerNotificationService;
