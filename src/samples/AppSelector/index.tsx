import React, { useState } from "react";
import { Switch, Route } from 'react-router-dom';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import i18n from 'i18next';
// import EmbeddedTopLevel from "../Embedded/EmbeddedTopLevel";
import ChildBenefitsClaim from '../ChildBenefitsClaim/index';
import CookiePage from '../ChildBenefitsClaim/cookiePage/index';
import Accessibility from '../ChildBenefitsClaim/AccessibilityPage';
import ReturnSlip from '../ChildBenefitsClaim/ReturnSlip/ReturnSlip';

const AppSelector = () => {
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en',
      backend: {
        /* translation file path */
        loadPath: `assets/i18n/{{lng}}.json`
      },
      fallbackLng: 'en',
      debug: false,
      returnNull: false,
      react: {
        useSuspense: false,
      }
    });

  const [content, setContent] = useState('');

  return (
    <Switch>
      <Route exact path='/' render={setContent => <ChildBenefitsClaim setReturnSlipContent={setContent}/>}/>
      <Route path='/cookies' component={CookiePage} />
      <Route path='/accessibility' component={Accessibility} />
      <Route path='/returnSlip' render={content => <ReturnSlip content={content}/>} />
    </Switch>
  );

};

export default AppSelector;
