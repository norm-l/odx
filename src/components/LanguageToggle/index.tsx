import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('en');

  const changeLanguage = event => {
    setSelectedLang(event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div onChange={changeLanguage}>
      <label className='mr10'>
        <input type='radio' value='en' name='language' checked={selectedLang === 'en'} /> English
      </label>
      <label>
        <input type='radio' value='cy' name='language' checked={selectedLang === 'cy'} /> Cymraeg
      </label>
    </div>
  );
};

export default LanguageToggle;
