<div align="center">

# 📿 ZikrCounter - Zikir Sayacı Uygulaması

**React Native, Redux ve Expo ile Geliştirilmiş Modern Zikir Sayacı ve Namaz Vakitleri Mobil Uygulaması**

[![React Native](https://img.shields.io/badge/React_Native-0.76.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.8-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.2.7-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![React Native Paper](https://img.shields.io/badge/React_Native_Paper-5.12.5-6200EE?style=for-the-badge&logo=material-design&logoColor=white)](https://reactnativepaper.com/)

[📱 Demo](#-demo) • [📋 Özellikler](#-özellikler) • [🛠️ Teknolojiler](#️-teknolojiler) • [🚀 Kurulum](#-kurulum)

</div>

---

## 📖 Hakkında

**ZikrCounter**, modern mobil teknolojiler kullanılarak geliştirilmiş kapsamlı bir zikir sayacı ve namaz vakitleri uygulamasıdır. React Native, Redux Toolkit ve Expo ile oluşturulmuş olup, kullanıcılara güvenli, hızlı ve kullanıcı dostu zikir sayma ve namaz takibi deneyimi sunmaktadır.

### 🎯 Projenin Amacı

- 📿 **Zikir Sayma** - Kolay ve hızlı zikir sayma sistemi
- 🕌 **Namaz Vakitleri** - 81 Türkiye şehrinde güncel namaz vakitleri
- 📍 **Akıllı Konum** - Otomatik şehir algılama ve seçimi
- 🔔 **Namaz Bildirimleri** - Her namazdan 10 dakika önce ve namaz vaktinde bildirim
- ⏰ **Gerçek Zamanlı Geri Sayım** - Bir sonraki namaza kadar kalan süre
- 🎨 **Tema Seçimi** - 21 farklı arka plan teması
- 🌍 **Çoklu Dil Desteği** - Türkçe, İngilizce, Arapça
- 🔊 **Ses Efektleri** - Zikir sayma ses efektleri
- 📱 **Cross-Platform** - iOS ve Android uyumlu
- 💾 **Veri Kalıcılığı** - AsyncStorage ile veri saklama
- 🔄 **Arka Plan Çalışma** - Uygulama kapalıyken bile bildirimler

---

## 🚀 Demo

**🔗 [Canlı Demo](https://your-demo-url.com)**

Uygulama şu anda geliştirme aşamasındadır. Demo linki yakında eklenecektir.

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** (v16 veya üzeri)
- **npm** veya **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (Android geliştirme için)
- **Xcode** (iOS geliştirme için - sadece macOS)

### Adım Adım Kurulum

1. **Depoyu klonlayın**
   ```bash
   git clone https://github.com/gezerm85/ZikrCounter.git
   cd ZikrCounter
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   # veya
   yarn install
   ```

3. **Konfigürasyon ayarlarını yapın**
   ```bash
   # app.json dosyasında aşağıdaki değerleri kendi bilgilerinizle değiştirin:
   # - YOUR_ANDROID_APP_ID_HERE -> AdMob Android App ID
   # - YOUR_IOS_APP_ID_HERE -> AdMob iOS App ID
   # - YOUR_EAS_PROJECT_ID_HERE -> EAS Project ID
   
   # src/components/AdBanner/AdBanner.js ve src/components/InterstitialAd/InterstitialAd.js dosyalarında:
   # - YOUR_PRODUCTION_BANNER_ID_HERE -> AdMob Banner Ad Unit ID
   # - YOUR_PRODUCTION_INTERSTITIAL_ID_HERE -> AdMob Interstitial Ad Unit ID
   ```

4. **Uygulamayı başlatın**
   ```bash
   # Expo ile çalıştır
   npx expo start
   
   # Android'de çalıştır
   npx expo run:android
   
   # iOS'ta çalıştır
   npx expo run:ios
   
   # Web'de çalıştır
   npx expo start --web
   ```

### Build Komutları

```bash
# Development
npm start

# Android build
npm run android

# iOS build
npm run ios

# Web build
npm run web
```

---

## 📋 Geliştirdiğim Özellikler

### 📿 Zikir Sayma Sistemi
- [x] **Zikir Sayacı** - Dokunmatik zikir sayma
- [x] **Ses Efektleri** - Zikir sayma ses efektleri (sadece ana buton)
- [x] **Titreşim Desteği** - Zikir sayma titreşimi
- [x] **Sıfırlama** - Zikir sayacını sıfırlama
- [x] **Kaydetme** - Zikir sayısını kaydetme

### 🕌 Namaz Vakitleri Sistemi
- [x] **81 Şehir Desteği** - Türkiye'nin tüm illerinde namaz vakitleri
- [x] **Akıllı Konum** - Otomatik şehir algılama ve seçimi
- [x] **Gerçek Zamanlı Geri Sayım** - Bir sonraki namaza kadar kalan süre
- [x] **Namaz Bildirimleri** - Her namazdan 10 dakika önce ve namaz vaktinde bildirim
- [x] **Arka Plan Çalışma** - Uygulama kapalıyken bile bildirimler
- [x] **Şehir Değiştirme** - Kolay şehir seçimi ve değiştirme
- [x] **API Entegrasyonu** - Aladhan API ile güncel namaz vakitleri

### ❤️ Favori Sistemi
- [x] **Favori Zikirler** - Zikir sayılarını favorilere ekleme
- [x] **Favori Listesi** - Kaydedilen zikirleri görüntüleme
- [x] **Düzenleme** - Favori zikirleri düzenleme
- [x] **Silme** - Favori zikirleri silme
- [x] **Persistent Storage** - Favori verilerini kalıcı depolama

### 🎨 Tema ve Özelleştirme
- [x] **Çoklu Tema** - 20+ farklı renk teması
- [x] **Yazı Tipi Boyutu** - Özelleştirilebilir yazı boyutu
- [x] **Gradient Renkler** - Dinamik gradient arka planlar
- [x] **Tema Kaydetme** - Seçilen temayı kaydetme
- [x] **Anlık Değişim** - Tema değişikliklerini anında görme

### 🌍 Çoklu Dil Desteği
- [x] **9 Dil Desteği** - TR, EN, AR, BN, FA, ID, MS, SW, UR
- [x] **i18next Entegrasyonu** - Profesyonel çeviri sistemi
- [x] **Dinamik Dil Değişimi** - Anlık dil değiştirme
- [x] **Yerel Dil Algılama** - Otomatik dil algılama

### ⚙️ Ayarlar ve Özellikler
- [x] **Titreşim Ayarları** - Titreşim açma/kapama
- [x] **Yazı Boyutu Ayarları** - 4 farklı yazı boyutu seçeneği
- [x] **Ses Ayarları** - Ses efektleri kontrolü
- [x] **Bildirim Sistemi** - Zikir hatırlatma bildirimleri
- [x] **Destek Sistemi** - E-posta ile destek talebi

### 🎨 UI/UX Geliştirmeleri
- [x] **Material Design** - React Native Paper ile modern tasarım
- [x] **Responsive Layout** - Tüm ekran boyutlarına uyumlu
- [x] **Smooth Animations** - Yumuşak geçiş animasyonları
- [x] **Loading States** - Kullanıcı dostu loading bileşenleri
- [x] **Error Handling** - Kapsamlı hata yönetimi

### 🔧 Teknik Geliştirmeler
- [x] **Redux Toolkit** - Merkezi state management
- [x] **AsyncStorage** - Yerel veri depolama
- [x] **Navigation System** - React Navigation ile sayfa geçişleri
- [x] **Audio System** - Expo AV ile ses yönetimi
- [x] **Performance Optimization** - Optimize edilmiş render

---

## 🛠️ Teknolojiler

### Frontend Framework
- **React Native** `0.76.5` - Cross-platform mobil uygulama
- **Expo** `54.0.8` - Geliştirme ortamı ve build sistemi
- **React Navigation** `6.x` - Navigasyon sistemi

### State Management
- **Redux Toolkit** `2.2.7` - Predictable state container
- **React Redux** `9.1.2` - React bindings for Redux

### UI & Styling
- **React Native Paper** `5.12.5` - Material Design components
- **React Native SVG** `15.2.0` - SVG support
- **Custom Fonts** - Digital-7 ve OpenSans fontları

### Storage & Data
- **AsyncStorage** `2.2.0` - Local data storage
- **Moment.js** `2.30.1` - Date/time manipulation
- **Moment Timezone** `0.6.0` - Timezone support
- **Axios** `1.12.2` - HTTP client

### Audio & Media
- **Expo Audio** `1.0.12` - Audio playback
- **Expo Speech** `14.0.7` - Text-to-speech
- **Expo Video** `3.0.11` - Video playback
- **Custom Sound Effects** - Zikir sayma ses efektleri

### Internationalization
- **i18next** `25.5.2` - Internationalization framework
- **react-i18next** `15.0.1` - React i18n integration
- **Expo Localization** `17.0.7` - Device locale detection

### Notifications & Ads
- **Expo Notifications** `0.32.11` - Push notifications
- **Google Mobile Ads** `15.7.0` - Advertisement integration
- **Expo Task Manager** `14.0.7` - Background tasks

### Development Tools
- **Expo Font** `14.0.8` - Custom font loading
- **Expo Splash Screen** `31.0.10` - Splash screen management
- **Expo Status Bar** `3.0.8` - Status bar management
- **Expo Build Properties** `1.0.8` - Build configuration

---

## 🔧 Geliştirme

### Geliştirme Komutları

```bash
# Geliştirme sunucusunu başlat
npm start

# Android'de çalıştır
npm run android

# iOS'ta çalıştır
npm run ios

# Web'de çalıştır
npm run web
```

### Redux Store Yapısı

```javascript
{
  counter: {
    value: 0,                    // Zikir sayısı
    favorite: [],               // Favori zikirler
    currentIndex: 0,            // Seçili tema indeksi
    vibrationEnabled: true,     // Titreşim durumu
    fontSize: 68,              // Yazı boyutu
    loading: false,            // Loading durumu
    error: null                // Hata durumu
  }
}
```

### AsyncStorage Kullanımı

```javascript
// Zikir sayısını kaydetme
await AsyncStorage.setItem("value", JSON.stringify(value));

// Favori zikirleri kaydetme
await AsyncStorage.setItem("favorites", JSON.stringify(favorites));

// Tema indeksini kaydetme
await AsyncStorage.setItem("currentIndex", JSON.stringify(currentIndex));
```

---

## 🚀 Deployment

### Expo Build

```bash
# EAS Build kurulumu
npm install -g @expo/cli
npx expo install @expo/cli

# Build oluştur
eas build --platform android
eas build --platform ios
eas build --platform all
```

### APK Build

```bash
# Android APK
eas build --platform android --profile preview

# iOS Build
eas build --platform ios --profile preview
```

---

## 🤝 Katkıda Bulunma

1. Bu depoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

### Geliştirme Kuralları
- React Native best practices'leri takip edin
- Redux state'ini immutable tutun
- Responsive tasarım prensiplerini uygulayın
- Performance optimizasyonlarını göz önünde bulundurun
- Çoklu dil desteğini koruyun

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👨‍💻 Geliştirici

**Bu projeyi geliştiren: Mehmet Çelebi Gezer**

Bu zikir sayacı uygulaması, modern mobil teknolojiler kullanılarak geliştirilmiştir. React Native, Redux Toolkit ve Expo ile oluşturulmuş olup, kullanıcı dostu arayüzü, çoklu dil desteği ve özelleştirilebilir temalar ile profesyonel bir zikir sayma deneyimi sunmaktadır.

### 🎯 Proje Detayları
- **Geliştirme Süresi:** [X] hafta/gün
- **Kullanılan Teknolojiler:** React Native, Redux Toolkit, Expo, i18next
- **Özellikler:** Zikir sayma, Favori sistemi, Çoklu dil, Tema özelleştirme
- **Platform:** iOS, Android, Web

---

## 🙏 Teşekkürler

- [React Native](https://reactnative.dev/) ekibine
- [Expo](https://expo.dev/) ekibine
- [Redux](https://redux.js.org/) ekibine
- [React Native Paper](https://reactnativepaper.com/) ekibine
- [i18next](https://www.i18next.com/) ekibine
- Tüm açık kaynak katkıda bulunanlara

---

## 📞 İletişim

**Proje Hakkında Sorularınız İçin:**

- 📧 **E-posta:** [gezermcelebi@gmail.com](mailto:gezermcelebi@gmail.com)
- 💼 **LinkedIn:** [Mehmet Çelebi Gezer](https://www.linkedin.com/in/mehmet-%C3%A7elebi-gezer-605a38217/)
- 🐙 **GitHub:** [@gezerm85](https://github.com/gezerm85)

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ by **Mehmet Çelebi Gezer**

*Modern mobil teknolojiler ile geliştirilmiş profesyonel zikir sayacı uygulaması*

</div>