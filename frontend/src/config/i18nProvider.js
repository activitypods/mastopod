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

const i18nProvider = polyglotI18nProvider(getMessages, import.meta.env.VITE_APP_LANG);

export default i18nProvider;
