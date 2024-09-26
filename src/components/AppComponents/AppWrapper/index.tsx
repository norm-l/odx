import React, { useEffect, useState } from 'react';
import AppHeader from '../AppHeader';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../BaseComponents/MainWrapper';
import AppFooter from '../AppFooter';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import { registerServiceName } from '../../helpers/setPageTitleHelpers';

export default function AppWrapper({ children, match }) {
  const { parent } = match.params;
  const { t } = useTranslation();

  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    getSdkConfig().then(sdkConfig => {
      const { serviceName: name } = sdkConfig.applicationConfig[parent];
      setServiceName(name);
      registerServiceName(t(name));
    });
  }, []);

  return (
    <>
      <AppHeader appname={t(serviceName)} hasLanguageToggle isPegaApp={false} />
      <div className='govuk-width-container'>
        <MainWrapper showPageNotWorkingLink={false}>{children}</MainWrapper>
      </div>
      <AppFooter pageUrl={parent} />
    </>
  );
}
