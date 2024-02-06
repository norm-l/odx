import { useState, useEffect } from 'react';

export default function useTranslatedText(text, category, localeReference) {
  const lang = document.documentElement.lang;

  const [translatedText, setTranslatedText] = useState<string>('');

  // Set inital title
  useEffect(() => {
    setTranslatedText(PCore.getLocaleUtils().getLocaleValue(text, category, localeReference));
  }, [text]);

  // Resets title if the user changes the language
  useEffect(() => {
    const translate = setTimeout(() => {
      setTranslatedText(PCore.getLocaleUtils().getLocaleValue(text, category, localeReference));
    }, 500);
    return () => {
      clearTimeout(translate);
    };
  }, [lang]);

  return translatedText;
}
