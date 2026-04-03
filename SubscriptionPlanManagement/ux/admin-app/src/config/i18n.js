import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import các file json của bạn
import translationEN from '../../../../services/subscription-service/src/config/lang/en.json';
import translationVI from '../../../../services/subscription-service/src/config/lang/vi.json';

const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI }
};

i18n
  .use(LanguageDetector) // Tự động nhận diện ngôn ngữ trình duyệt
  .use(initReactI18next) // Kết nối với React
  .init({
    resources,
    fallbackLng: 'en', // Ngôn ngữ mặc định
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;