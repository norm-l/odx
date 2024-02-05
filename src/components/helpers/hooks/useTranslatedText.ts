import { useState, useEffect } from 'react';

export default function useTranslatedText(thePConn, text, category, localeReference) {
  const lang = document.documentElement.lang;

  const [translatedText, setTranslatedText] = useState<string>('');

  useEffect(() => {
    setTranslatedText(thePConn.getLocalizedValue(text, category, localeReference));
  }, [text]);

  useEffect(() => {
    const translate = setTimeout(() => {
      setTranslatedText(thePConn.getLocalizedValue(text, category, localeReference));
    }, 500);
    return () => {
      clearTimeout(translate);
    };
  }, [lang]);

  return translatedText;
}
