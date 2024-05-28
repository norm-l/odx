import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import Button from '../../components/BaseComponents/Button/Button';
import AppHeader from './reuseables/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
// import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import AppContext from './reuseables/AppContext';
import { loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';
import { useStartMashup } from './reuseables/PegaSetup';
import { triggerLogout } from '../../components/helpers/utils';

export default function LandingPage(props) {
  const { onProceedHandler } = props;
  const { showLanguageToggle } = useContext(AppContext);

  const { hmrcURL } = useHMRCExternalLinks();
  const history = useHistory();
  const setAuthType = useState('gg')[1];

  const { operatorName } = useStartMashup(
    setAuthType,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    doRedirectDone,
    { appBacklinkProps: {} }
  );

  const { t } = useTranslation();

  const onContinue = () => {
    onProceedHandler();
  };

  function doRedirectDone() {
    history.push('/education/start');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'embedded', mainRedirect: true });
  }

  function handleSignout() {
    triggerLogout();
  }

  return (
    <>
      <AppHeader
        handleSignout={handleSignout}
        appname={t('EDUCATION_START')}
        hasLanguageToggle={showLanguageToggle}
        betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=463&referrerUrl=${window.location}`}
      />
      <div className='govuk-width-container'>
        <MainWrapper>
          <span className='govuk-caption-xl'>{operatorName}</span>
          <h1 className='govuk-heading-xl'>
            Extend your Child Benefit payments while a young person stays in education
          </h1>
          <p className='govuk-body'>Use this form if they will be studying:</p>
          <ul className='govuk-list govuk-list--bullet'>
            <li>GCSEs or A levels</li>
            <li>BTECs, level 1, 2 or 3</li>
            <li>T levels</li>
            <li>NVQs, level 1, 2 or 3</li>
            <li>International Baccalaureate</li>
            <li>
              Scottish Highers — up to and including level 7 (apart from HNC level 7 or the
              Certificate of Higher Education level 7, because these are advanced courses)
            </li>
          </ul>
          <p className='govuk-body'>
            <a
              className='govuk-link'
              href='https://www.gov.uk/government/publications/child-benefit-child-continuing-in-approved-education-or-training-ch297'
              target='_blank'
              rel='noreferrer noopener'
            >
              If they&#39;ll be studying something else, you can still extend your payments
            </a>{' '}
            but you need to use a different form.
          </p>
          <p className='govuk-body'>The young person will need to be:</p>
          <ul className='govuk-list govuk-list--bullet'>
            <li>GCSEs or A levels</li>
            <li>BTECs, level 1, 2 or 3</li>
            <li>T levels</li>
            <li>NVQs, level 1, 2 or 3</li>
            <li>International Baccalaureate</li>
            <li>
              Scottish Highers — up to and including level 7 (apart from HNC level 7 or the
              Certificate of Higher Education level 7, because these are advanced courses)
            </li>
          </ul>
          <Button id='continueToOptin' onClick={onContinue} variant='start'>
            {t('CONTINUE')}
          </Button>
          <br />
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
}
