import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import moment from 'moment-timezone';
import PrayerNotificationService from './PrayerNotificationService';

// Background task name
const PRAYER_NOTIFICATION_TASK = 'PRAYER_NOTIFICATION_TASK';

// Background task tanımı
TaskManager.defineTask(PRAYER_NOTIFICATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background task error:', error);
    return;
  }

  try {
    console.log('🔄 Background task çalışıyor...');
    
    // Namaz vakitlerini kontrol et ve bildirimleri planla
    await PrayerNotificationService.checkAndSchedulePrayerNotifications();
    
    console.log('✅ Background task tamamlandı');
  } catch (error) {
    console.error('❌ Background task hatası:', error);
  }
});

class BackgroundTaskService {
  // Background task'ı kaydet
  static async registerBackgroundTask() {
    try {
      if (Platform.OS === 'android') {
        await Notifications.registerTaskAsync(PRAYER_NOTIFICATION_TASK);
      }
    } catch (error) {
      console.error('❌ Background task kayıt hatası:', error);
    }
  }

  // Background task'ı başlat
  static async startBackgroundTask() {
    try {
      if (Platform.OS === 'android') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'ZikirMatik',
            body: 'Namaz vakitleri takip ediliyor...',
            data: { type: 'background_start' },
          },
          trigger: { type: 'timeInterval', seconds: 1 },
        });
        
        console.log('✅ Background task başlatıldı');
      }
    } catch (error) {
      console.error('❌ Background task başlatma hatası:', error);
    }
  }

  // Background task'ı durdur
  static async stopBackgroundTask() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ Background task durduruldu');
    } catch (error) {
      console.error('❌ Background task durdurma hatası:', error);
    }
  }
}

export default BackgroundTaskService;
