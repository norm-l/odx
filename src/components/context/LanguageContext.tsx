import dayjs from 'dayjs';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../helpers/setPageTitleHelpers';

const LanguageContext = createContext(null);

export const LanguageContextProvider = ({ children }) => {
  const { i18n } = useTranslation();

  return <LanguageContext.Provider value={{}}>{children}</LanguageContext.Provider>;
};

export const useLanguageContext = () => useContext(LanguageContext);
