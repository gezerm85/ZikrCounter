import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";


import tr from "../locales/tr.json";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import bn from "../locales/bn.json";
import fa from "../locales/fa.json";
import id from "../locales/id.json";
import ms from "../locales/ms.json";
import sw from "../locales/sw.json";
import ur from "../locales/ur.json";


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
  bn: {
    translation: bn,
  },
  fa: {
    translation: fa,
  },
  id: {
    translation: id,
  },
  ms: {
    translation: ms,
  },
  sw: {
    translation: sw,
  },
  ur: {
    translation: ur,
  },
};


const languageTag = getLocales()[0]?.languageTag?.split("-")[0] || "tr";


i18n.use(initReactI18next).init({
  resources,
  lng: languageTag,
  fallbackLng: "tr",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3",
});

export default i18n;
