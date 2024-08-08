import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginIfNecessary, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from '../HighIncomeCase/reuseables/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';
import { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import { triggerLogout } from '../../components/helpers/utils';

import MainWrapper from '../../components/BaseComponents/MainWrapper';
// import { Link } from 'react-router-dom';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';
import { initTimeout } from '../../components/AppComponents/TimeoutPopup/timeOutUtils';
import WarningText from '../../components/BaseComponents/GDSWarningText/WarningText';
import Button from '../../components/BaseComponents/Button/Button';

export default function ChangeOfBank() {
  const history = useHistory();
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const { t } = useTranslation();
  const { referrerURL, hmrcURL } = useHMRCExternalLinks();

  registerServiceName(t('CHB_HOMEPAGE_HEADING'));
  const onRedirectDone = () => {
    history.replace('/change-of-bank');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'embedded', mainRedirect: true });
  };

  useEffect(() => {
    initTimeout(setShowTimeoutModal, false, true, false);
  }, []);

  useEffect(() => {
    if (!sdkIsLoggedIn()) {
      loginIfNecessary({ appName: 'embedded', mainRedirect: true, redirectDoneCB: onRedirectDone });
    }
  }, []);

  const handleSignout = () => {
    triggerLogout();
  };
  const handleStartCOB = () => {};

  return sdkIsLoggedIn() ? (
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
          PCore.getUserApi().getOperatorDetails(PCore.getEnvironmentInfo().getOperatorIdentifier());
        }}
        signoutHandler={triggerLogout}
        isAuthorised
        signoutButtonText='Sign out'
        staySignedInButtonText='Stay signed in'
      />
      <div className='govuk-width-container'>
        <MainWrapper>
          <h1 className='govuk-heading-xl'>{t('COB_PAGE_HEADING')}</h1>
          <WarningText className='govuk-body'>{t('COB_PAGE_WARRNING')}</WarningText>
          <p className='govuk-body'>{t('COB_PAGE_P1')}</p>
          <p className='govuk-body'>
            {t('COB_PAGE_P2')}
            <a href={`${referrerURL}recently-claimed-child-benefit`} className='govuk-link'>
              {t('COB_PAGE_MAKE_A_CLAIM')}
            </a>
            .
          </p>
          <p className='govuk-body'>{t('COB_PAGE_P3')}</p>

          <Button
            id='continueToPortal'
            onClick={handleStartCOB}
            variant='start'
            data-prevent-double-click='true'
          >
            {t('START_NOW')}
          </Button>
        </MainWrapper>
      </div>

      <AppFooter />
    </>
  ) : (
    <></>
  );
}
