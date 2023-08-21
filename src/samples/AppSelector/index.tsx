import React from "react";
import { Switch, Route, useLocation } from 'react-router-dom';
// import EmbeddedTopLevel from "../Embedded/EmbeddedTopLevel";
import ChildBenefitsClaim from '../ChildBenefitsClaim/index';
import CookiePage from '../ChildBenefitsClaim/cookiePage/CookiePage';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import i18n from 'i18next';

const baseURL = "/";

const AppSelector = () => {

  const { pathname } = useLocation();

  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en',
      backend: {
        /* translation file path */
        loadPath: `${window.location.pathname.replace(pathname,'')}assets/i18n/{{lng}}.json`
      },
      fallbackLng: 'en',
      debug: false,
      returnNull: false,
      react: {
        useSuspense: false,
      }
    });

  return (
    <>
      <Switch>
        <Route exact path={baseURL} component={ChildBenefitsClaim} />
        <Route path="/cookies" component={CookiePage} />
        <Route path="*" component={ChildBenefitsClaim} />
      </Switch>
    </>
  )

};

export default AppSelector;
