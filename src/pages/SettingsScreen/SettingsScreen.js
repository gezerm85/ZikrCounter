import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Linking,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fixedColors, vectorThemes } from '../../utils/Theme/VectorTheme';
import { changeGradientColor, setFontSize, setNotificationPermission } from '../../redux/CounterSlice';
import PrayerNotificationService from '../../services/PrayerNotificationService';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import ThemeModal from '../../components/ThemeModal/ThemeModal';
import AdBanner from '../../components/AdBanner/AdBanner';
import InterstitialAd from '../../components/InterstitialAd/InterstitialAd';
import CustomHeader from '../../components/CustomHeader/CustomHeader';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { currentIndex, fontSize, selectedCity, notificationPermission } = useSelector((state) => state.counter);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  
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

  const handleEmailPress = () => {
    const email = "mobiflextech@gmail.com";
    const subject = t("SUPPORT_REQUEST");
    const body = t("SUPPORT_MESSAGE");
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl)
      .then((supported) => {
        if (!supported) {
          alert(t("MAIL_ERROR"));
        }
      })
      .catch((error) => console.log("Error:", error));
  };

  const buttonSizes = [64, 68, 72, 76];

  const fontSizeLabels = {
    64: t('FONT_SIZE_64'),
    68: t('FONT_SIZE_68'),
    72: t('FONT_SIZE_72'),
    76: t('FONT_SIZE_76'),
  };

  const handleNotificationToggle = async () => {
    if (notificationPermission) {
      // Bildirimleri kapat
      await PrayerNotificationService.cancelAllNotifications();
      dispatch(setNotificationPermission(false));
    } else {
      // Bildirim izni iste
      const hasPermission = await PrayerNotificationService.requestPermissions();
      dispatch(setNotificationPermission(hasPermission));
      
      if (hasPermission) {
        // Mevcut namaz vakitleri varsa bildirimleri planla
        // Bu kısım PrayerTimes component'inde otomatik olarak yapılacak
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: fixedColors.bgColor }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
      {/* Header */}
      <CustomHeader 
        title={t("SETTINGS")} 
        subtitle={t("MANAGE_APP_PREFERENCES")} 
      />

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("THEME")}</Text>
        <View style={styles.themeContainer}>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={() => setIsThemeModalVisible(true)}
          >
            <View style={[
              styles.themePreview,
              { backgroundColor: fixedColors.bgColor }
            ]}>
              <View style={[
                styles.themeCard,
                { backgroundColor: fixedColors.cardColor }
              ]} />
            </View>
            <Text style={styles.themeLabel}>{t("CHANGE_THEME")}</Text>
            <MaterialIcons name="palette" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Font Size Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("FONTSİZE")}</Text>
        <View style={styles.fontContainer}>
          {buttonSizes.map((size) => {
            const isSelected = fontSize === size;
            return (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontButton,
                  isSelected && styles.fontButtonSelected
                ]}
                onPress={() => dispatch(setFontSize(size))}
              >
                <Text style={[
                  styles.fontSizeText,
                  isSelected && styles.fontSizeTextSelected
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Notification Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("NOTIFICATIONS")}</Text>
        <View style={styles.notificationContainer}>
          <Pressable style={styles.notificationButton} onPress={handleNotificationToggle}>
            <View style={styles.notificationIconContainer}>
              <MaterialIcons 
                name={notificationPermission ? "notifications" : "notifications-off"} 
                size={20} 
                color={notificationPermission ? "#34C759" : "#666"} 
              />
            </View>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationLabel}>{t("PRAYER_NOTIFICATIONS")}</Text>
              <Text style={styles.notificationValue}>
                {notificationPermission ? t("ENABLED") : t("DISABLED")}
              </Text>
            </View>
            <MaterialIcons 
              name={notificationPermission ? "toggle-on" : "toggle-off"} 
              size={48} 
              color={notificationPermission ? "#34C759" : "#666"} 
            />
          </Pressable>
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("LOCATION")}</Text>
        <View style={styles.locationContainer}>
          <Pressable style={styles.locationButton} onPress={() => navigation.navigate('MainStack', { screen: 'CitySelection' })}>
            <View style={styles.locationIconContainer}>
              <MaterialIcons name="location-on" size={20} color="#007AFF" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>{t("PRAYER_TIMES_CITY")}</Text>
              <Text style={styles.locationValue}>{selectedCity?.name || 'İstanbul'}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </Pressable>
        </View>
      </View>

      {/* More Options Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("OTHER")}</Text>
        <View style={styles.menuContainer}>
          <Pressable style={styles.menuItem} onPress={() => {
            // Play Store'a yönlendirme
            Linking.openURL('https://play.google.com/store/apps/details?id=com.zikirmatik.app.mobiflex');
          }}>
            <View style={styles.menuIconContainer}>
              <FontAwesome name="star" size={20} color="#FFD700" />
            </View>
            <Text style={styles.menuText}>{t("RATE_US")}</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={handleEmailPress}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="mail" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>{t("SUPPORT")}</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => navigation.navigate('MainStack', { screen: 'PrivacyPolicy' })}>
            <View style={styles.menuIconContainer}>
              <MaterialIcons name="security" size={20} color="#34C759" />
            </View>
            <Text style={styles.menuText}>{t("PRIVACY_POLICY")}</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => navigation.navigate('MainStack', { screen: 'TermsOfService' })}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="document-text" size={20} color="#FF9500" />
            </View>
            <Text style={styles.menuText}>{t("TERMS_OF_SERVICE")}</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </Pressable>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>ZikirMatik</Text>
        <Text style={styles.appVersion}>v1.0.9</Text>
      </View>

      {/* Theme Modal */}
      <ThemeModal
        isVisible={isThemeModalVisible}
        onClose={() => setIsThemeModalVisible(false)}
      />
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
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'OpenSans',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeCard: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  themeLabel: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'OpenSans',
    fontWeight: '500',
  },
  fontContainer: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  fontButton: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fontButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'OpenSans',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  fontSizeTextSelected: {
    color: '#fff',
  },
  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 8, 8, 0.1)',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'OpenSans',
    color: '#fff',
  },
  locationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'OpenSans',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'OpenSans',
    fontWeight: '600',
  },
  notificationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  notificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'OpenSans',
    marginBottom: 2,
  },
  notificationValue: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'OpenSans',
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'OpenSans',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'OpenSans',
  },
});

export default SettingsScreen;
