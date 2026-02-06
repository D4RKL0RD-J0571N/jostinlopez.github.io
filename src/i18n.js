// i18n.js - v1.0.2 - Force Refresh 1769841721053
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/common.json';
import es from './locales/es/common.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            es: { translation: es }
        },
        fallbackLng: 'en',
        debug: true, // Set to false in production
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
