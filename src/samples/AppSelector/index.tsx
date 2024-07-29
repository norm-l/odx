import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import i18n from 'i18next';
import SAReg from '../SaReg/index';
import CookiePage from '../SaReg/cookiePage/index';
import Accessibility from '../SaReg/AccessibilityPage';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';

const AppSelector = () => {
  const [i18nloaded, seti18nloaded] = useState(false);

  useEffect(() => {
    i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        lng: sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en',
        backend: {
          loadPath: `assets/i18n/{{lng}}.json`
        },
        fallbackLng: 'en',
        debug: false,
        returnNull: false,
        react: {
          useSuspense: false
        }
      })
      .finally(() => {
        seti18nloaded(true);
        setPageTitle();
      });
  }, []);

  return !i18nloaded ? null : (
    <Switch>
      <Route exact path='/' component={SAReg} />
      <Route path='/cookies' component={CookiePage} />
      <Route path='/accessibility' component={Accessibility} />
    </Switch>
  );
};

export default AppSelector;
