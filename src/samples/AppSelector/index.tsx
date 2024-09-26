import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import i18n from 'i18next';
import Registration from '../Registration/index';
import CookiePage from '../Registration/cookiePage/index';
import Accessibility from '../Registration/AccessibilityPage';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import ProtectedRoute from '../../components/HOC/ProtectedRoute';
import Cessation from '../Cessation';
import AppWrapper from '../../components/AppComponents/AppWrapper';

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
      
        <Route exact path='/' render={() => <Redirect to='/registration' />} />
        <ProtectedRoute exact path='/registration' component={Registration} />
        <ProtectedRoute exact path='/cessation' component={Cessation} />
        {/* Public Routes */}
        <Route
          exact
          path='/:parent/cookies'
          render={props => (
            <AppWrapper {...props}>
              <CookiePage />
            </AppWrapper>
          )}
        />
        <Route
          exact
          path='/:parent/accessibility'
          render={props => (
            <AppWrapper {...props}>
              <Accessibility />
            </AppWrapper>
          )}
        />
    </Switch>
  );
};

export default AppSelector;
