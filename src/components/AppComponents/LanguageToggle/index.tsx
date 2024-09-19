import React, { useContext } from 'react';
import { LanguageContext } from '../../../context/LangauageContext';

const LanguageToggle = () => {
  const { currentLanguage, setCurrentLanguage } = useContext(LanguageContext);

  return (
    <nav id='hmrc-language-toggle' className='hmrc-language-select' aria-label='Language switcher'>
      <ul className='hmrc-language-select__list'>
        <li className='hmrc-language-select__list-item'>
          {currentLanguage === 'en' ? (
            <span aria-current='true'>English</span>
          ) : (
            <a
              href='#'
              onClick={() => setCurrentLanguage('en')}
              rel='alternate'
              className='govuk-link'
            >
              <span className='govuk-visually-hidden'>Change the language to English</span>
              <span aria-hidden='true'>English</span>
            </a>
          )}
        </li>
        <li className='hmrc-language-select__list-item'>
          {currentLanguage === 'cy' ? (
            <span aria-current='true'>Cymraeg</span>
          ) : (
            <a
              href='#'
              onClick={() => setCurrentLanguage('cy')}
              rel='alternate'
              className='govuk-link'
            >
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
