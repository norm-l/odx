import React, { FunctionComponent, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LandingPage from './LandingPage';
import ClaimPage from './ClaimPage';
import setPageTitle, { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from './reuseables/AppHeader';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import AppFooter from '../../components/AppComponents/AppFooter';
import AppContext from './reuseables/AppContext';

const HighIncomeCase: FunctionComponent<any> = () => {
  const [showLandingPage, setShowLandingPage] = useState<boolean>(
    !window.location.search.includes('code')
  );
  const [shuttered, setShuttered] = useState(null);
  const [showLanguageToggle, setShowLanguageToggle] = useState(false);

  const { t } = useTranslation();
  registerServiceName(t('HICBC_APP_NAME'));
  const landingPageProceedHandler = () => {
    localStorage.setItem('showLandingPage', 'false');
    setShowLandingPage(false);
  };
  useEffect(() => {
    getSdkConfig().then(config => {
      setShowLanguageToggle(config?.hicbcOptinConfig?.showLanguageToggle);
    });
  }, []);

  useEffect(() => {
    getSdkConfig().then(config => {
      if (config.hicbcOptinConfig?.shutterService) {
        setShuttered(config.hicbcOptinConfig.shutterService);
      } else {
        setShuttered(false);
      }
    });
  }, []);

  if (shuttered === null) {
    return null;
  } else if (shuttered) {
    setPageTitle();
    return (
      <>
        <AppHeader appname={t('HICBC_APP_NAME')} hasLanguageToggle={false} />
        <div className='govuk-width-container'>
          <MainWrapper showPageNotWorkingLink={false}>
            <h1 className='govuk-heading-l'>{t('SHUTTER_SERVICE_UNAVAILABLE')}</h1>
            <p className='govuk-body'>{t('TRY_AGAIN_LATER')}</p>
            <p className='govuk-body'>
              {t('HICBC_ERROR_RETURN_TO')}{' '}
              <a className='govuk-link' href='https://www.gov.uk/child-benefit'>
                {t('HICBC_ERROR_RETURN_LINK')}
              </a>
              .
            </p>
          </MainWrapper>
        </div>
        <AppFooter />
      </>
    );
  } else {
    return (
      <AppContext.Provider value={{ appBacklinkProps: {}, showLanguageToggle }}>
        {showLandingPage ? (
          <LandingPage onProceedHandler={() => landingPageProceedHandler()} />
        ) : (
          <ClaimPage />
        )}
      </AppContext.Provider>
    );
  }
};
export default HighIncomeCase;
