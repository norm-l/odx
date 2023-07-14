import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  let locale = sessionStorage.getItem('rsdk_locale') || 'en-GB';
  const [selectedLang, setSelectedLang] = useState(locale);
  // i18n.changeLanguage(lang);

  const changeLanguage = (e) => {
    e.preventDefault();
    locale = e.currentTarget.getAttribute('lang');
    setSelectedLang(locale);
    sessionStorage.setItem('rsdk_locale', locale);
    i18n.changeLanguage(locale);
    window.location.reload();
  };

  return (
    <nav className='hmrc-language-select' aria-label='Language switcher'>
      <ul className='hmrc-language-select__list'>
        <li className='hmrc-language-select__list-item'>
          {selectedLang === 'en-GB' ? (
            <span aria-current='true'>English</span>
          ) : (
            <a onClick={changeLanguage} lang='en-GB' rel='alternate' className='govuk-link'>
              <span className='govuk-visually-hidden'>Change the language to English</span>
              <span aria-hidden='true'>English</span>
            </a>
          )}
        </li>
        <li className='hmrc-language-select__list-item'>
          {selectedLang === 'cy-GB' ? (
            <span aria-current='true'>Cymraeg</span>
          ) : (
            <a onClick={changeLanguage} lang='cy-GB' rel='alternate' className='govuk-link'>
              <span className='govuk-visually-hidden'>Newid yr iaith ir Gymraeg</span>
              <span aria-hidden='true'>Cymraeg</span>
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default LanguageToggle;
