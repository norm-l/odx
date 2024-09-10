import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import i18n from 'i18next';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en',

    backend: {
      loadPath: `assets/i18n/{{lng}}.json`
    },
    fallbackLng: 'en',
    debug: false,
    returnNull: false,
    react: {
      useSuspense: false
    }
  });

export default i18n;
