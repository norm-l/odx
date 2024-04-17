import React from 'react';
import StartPage from './StartPage';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import toggleNotificationProcess from '../../components/helpers/toggleNotificationLanguage';
import { useTranslation } from 'react-i18next';

export default function EducationStart() {
  const { t } = useTranslation();

  return (
    <>
      <AppHeader
        appname={t('CHILD_BENEFIT')}
        hasLanguageToggle
        languageToggleCallback={toggleNotificationProcess(
          { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' },
          null
        )}
      />
      <div className='govuk-width-container'>
        <StartPage />
      </div>
      <AppFooter />
    </>
  );
}
