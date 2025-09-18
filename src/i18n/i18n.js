import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";


import tr from "../locales/tr.json";
import en from "../locales/en.json";
import ar from "../locales/ar.json";


const resources = {
  tr: {
    translation: tr,
  },
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};


const languageTag = getLocales()[0]?.languageTag?.split("-")[0] || "tr";


i18n.use(initReactI18next).init({
  resources,
  lng: languageTag,
  fallbackLng: "tr",
  returnObjects: true,
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3",
});

export default i18n;
