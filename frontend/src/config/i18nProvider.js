import { resolveBrowserLocale } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import raEnglishMessages from 'ra-language-english';
import raFrenchMessages from 'ra-language-french';
import { frenchMessages as authFrenchMessages, englishMessages as authEnglishMessages } from '@semapps/auth-provider';
import { frenchMessages as apodsFrenchMessages, englishMessages as apodsEnglishMessages } from '@activitypods/react';
import frAppMessages from './messages/fr';
import enAppMessages from './messages/en';

const getMessages = lang => {
  if (lang === 'en') {
    return {
      ...raEnglishMessages,
      ...authEnglishMessages,
      ...apodsEnglishMessages,
      ...enAppMessages
    };
  } else if (lang === 'fr') {
    return {
      ...raFrenchMessages,
      ...authFrenchMessages,
      ...apodsFrenchMessages,
      ...frAppMessages
    };
  } else {
    throw new Error('Language not handled: ' + lang);
  }
};

export const locales = [
  { locale: 'en', name: 'English' },
  { locale: 'fr', name: 'Français' }
];

// Filter locales based on the settings
export const availableLocales = locales.filter(e => import.meta.env.VITE_AVAILABLE_LOCALES.includes(e.locale));

const i18nProvider = polyglotI18nProvider(
  getMessages,
  resolveBrowserLocale(import.meta.env.VITE_DEFAULT_LOCALE),
  availableLocales
);

export default i18nProvider;
