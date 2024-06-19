import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../helpers/LoadingSpinner/LoadingSpinner';

declare const PCore: any;

const LanguageToggle = props => {
  const { languageToggleCallback } = props;
  const { i18n } = useTranslation();
  let lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const [selectedLang, setSelectedLang] = useState(lang);
  const [loading, setLoading] = useState(false);

  const changeLanguage = e => {
    e.preventDefault();
    lang = e.currentTarget.getAttribute('lang');
    setLoading(true);
    setSelectedLang(lang);
    sessionStorage.setItem('rsdk_locale', `${lang}_GB`);
    i18n.changeLanguage(lang);
    if (typeof PCore !== 'undefined') {
      PCore.getEnvironmentInfo().setLocale(`${lang}_GB`);
      PCore.getLocaleUtils().resetLocaleStore();
      PCore.getLocaleUtils().loadLocaleResources([
        PCore.getLocaleUtils().GENERIC_BUNDLE_KEY,
        '@BASECLASS!DATAPAGE!D_LISTREFERENCEDATABYTYPE',
        '@BASECLASS!DATAPAGE!D_SCOPEDREFERENCEDATALISTBYTYPE',
        'HMRC-CHB-WORK-CLAIM!CASE!CLAIM'
      ]);

      PCore.getPubSubUtils().publish('languageToggleTriggered', { language: lang, localeRef: [] });
    }
    if (languageToggleCallback) {
      languageToggleCallback(lang);
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  useEffect(() => {
    document.documentElement.lang = selectedLang;
  }, [selectedLang]);

  return (
    <>
      {loading && (
        <div className='loading-overlay'>
          <LoadingSpinner size='50px' label='Loading...' />
        </div>
      )}
      <nav
        id='hmrc-language-toggle'
        className='hmrc-language-select'
        aria-label='Language switcher'
      >
        <ul className='hmrc-language-select__list'>
          <li className='hmrc-language-select__list-item'>
            {selectedLang === 'en' ? (
              <span aria-current='true'>English</span>
            ) : (
              <a href='#' onClick={changeLanguage} lang='en' rel='alternate' className='govuk-link'>
                <span className='govuk-visually-hidden'>Change the language to English</span>
                <span aria-hidden='true'>English</span>
              </a>
            )}
          </li>
          <li className='hmrc-language-select__list-item'>
            {selectedLang === 'cy' ? (
              <span aria-current='true'>Cymraeg</span>
            ) : (
              <a href='#' onClick={changeLanguage} lang='cy' rel='alternate' className='govuk-link'>
                <span className='govuk-visually-hidden'>Newid yr iaith ir Gymraeg</span>
                <span aria-hidden='true'>Cymraeg</span>
              </a>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default LanguageToggle;
