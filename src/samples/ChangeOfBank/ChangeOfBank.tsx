import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginIfNecessary, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from '../HighIncomeCase/reuseables/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';
import { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import { triggerLogout } from '../../components/helpers/utils';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';
import LogoutPopup from '../../components/AppComponents/LogoutPopup';
import {
  initTimeout,
  staySignedIn
} from '../../components/AppComponents/TimeoutPopup/timeOutUtils';
import { useStartMashup } from '../HighIncomeCase/reuseables/PegaSetup';
import StartPage from './StartPage';

export default function ChangeOfBank() {
  const history = useHistory();
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  const { t } = useTranslation();
  const { hmrcURL } = useHMRCExternalLinks();
  const setAuthType = useState('gg')[1];

  registerServiceName(t('CHB_HOMEPAGE_HEADING'));
  const onRedirectDone = () => {
    history.replace('/change-of-bank');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'embedded', mainRedirect: true });
  };

  const { showPega, setShowPega } = useStartMashup(setAuthType, onRedirectDone, {
    appBacklinkProps: {}
  });

  useEffect(() => {
    initTimeout(setShowTimeoutModal, false, true, false);
  }, []);

  useEffect(() => {
    if (!sdkIsLoggedIn()) {
      loginIfNecessary({ appName: 'embedded', mainRedirect: true, redirectDoneCB: onRedirectDone });
    }
  }, []);

  const handleStartCOB = () => {
    setShowPega(true);
    PCore.getMashupApi().createCase('HMRC-ChB-Work-ChBChangeOfBank', PCore.getConstants().APP.APP);
  };

  function handleSignout() {
    if (showPega) {
      setShowSignoutModal(true);
    } else {
      triggerLogout();
    }
  }

  const handleStaySignIn = e => {
    e.preventDefault();
    setShowSignoutModal(false);
    // Extends manual signout popup 'stay signed in' to reset the automatic timeout timer also
    staySignedIn(setShowTimeoutModal, 'D_ClaimantSubmittedChBCases', null, null);
  };

  return (
    sdkIsLoggedIn() && (
      <>
        <AppHeader
          hasLanguageToggle
          betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=463&referrerUrl=${window.location}`}
          appname={t('CHB_HOMEPAGE_HEADING')}
          handleSignout={handleSignout}
        />
        <TimeoutPopup
          show={showTimeoutModal}
          staySignedinHandler={() => {
            setShowTimeoutModal(false);
            initTimeout(setShowTimeoutModal, false, true, false);
            // Using operator details call as 'app agnostic' session keep-alive
            PCore.getUserApi().getOperatorDetails(
              PCore.getEnvironmentInfo().getOperatorIdentifier()
            );
          }}
          signoutHandler={triggerLogout}
          isAuthorised
          signoutButtonText={t('SIGN-OUT')}
          staySignedInButtonText={t('STAY_SIGNED_IN')}
        />
        <div className='govuk-width-container'>
          {!showPega && <StartPage handleStartCOB={handleStartCOB} />}
          <div id='pega-part-of-page'>
            <div id='pega-root'></div>
          </div>
        </div>
        <LogoutPopup
          show={showSignoutModal && !showTimeoutModal}
          hideModal={() => setShowSignoutModal(false)}
          handleSignoutModal={triggerLogout}
          handleStaySignIn={handleStaySignIn}
          staySignedInButtonText={t('STAY_SIGNED_IN')}
          signoutButtonText={t('SIGN-OUT')}
        >
          <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
            {t('YOU_ARE_ABOUT_TO_SIGN_OUT')}
          </h1>
          <p className='govuk-body'>{t('SIGN_OUT_MSG')}</p>
        </LogoutPopup>
        <AppFooter />
      </>
    )
  );
}
