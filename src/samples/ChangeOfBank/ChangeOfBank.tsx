import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginIfNecessary, sdkIsLoggedIn, getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
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
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import { useStartMashup } from '../HighIncomeCase/reuseables/PegaSetup';
import StartPage from './StartPage';
import SummaryPage from '../../components/AppComponents/SummaryPage';
import toggleNotificationProcess from '../../components/helpers/toggleNotificationLanguage';
import { TIMEOUT_115_SECONDS } from '../../components/helpers/constants';

export default function ChangeOfBank() {
  const history = useHistory();
  const [millisecondsTillSignout, setmillisecondsTillSignout] = useState(TIMEOUT_115_SECONDS);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [summaryPageContent, setSummaryPageContent] = useState<any>({
    content: null,
    title: null,
    banner: null
  });

  const { t } = useTranslation();
  const { hmrcURL } = useHMRCExternalLinks();
  const setAuthType = useState('gg')[1];

  registerServiceName(t('COB_SERVICE_HEADING'));
  const onRedirectDone = () => {
    history.replace('/change-of-bank');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'ChB', mainRedirect: true });
  };

  const { showPega, setShowPega, caseId, showResolutionPage, assignmentPConn } = useStartMashup(
    setAuthType,
    onRedirectDone,
    {
      appBacklinkProps: {}
    }
  );

  useEffect(() => {
    initTimeout(setShowTimeoutModal, false, true, false);
  }, []);

  useEffect(() => {
    if (!sdkIsLoggedIn()) {
      loginIfNecessary({ appName: 'ChB', mainRedirect: true, redirectDoneCB: onRedirectDone });
    }
  }, []);

  useEffect(() => {
    if (showResolutionPage) {
      getSdkConfig().then(config => {
        if (config.timeoutConfig.secondsTilLogout) {
          setmillisecondsTillSignout(config.timeoutConfig.secondsTilLogout * 1000);
        }

        PCore.getRestClient()
          .invokeCustomRestApi(
            `${config.serverConfig.infinityRestServerUrl}/api/application/v2/cases/${caseId}?pageName=SubmissionSummary`,
            {
              method: 'GET',
              body: '',
              headers: '',
              withoutDefaultHeaders: false
            },
            ''
          )
          .then(response => {
            PCore.getPubSubUtils().unsubscribe(
              'languageToggleTriggered',
              'summarypageLanguageChange'
            );
            const summaryData: Array<any> =
              response.data.data.caseInfo.content.ScreenContent.LocalisedContent;
            const currentLang =
              sessionStorage.getItem('rsdk_locale')?.slice(0, 2).toUpperCase() || 'EN';

            setSummaryPageContent(summaryData.find(data => data.Language === currentLang));

            PCore.getPubSubUtils().subscribe(
              'languageToggleTriggered',
              ({ language }) => {
                setSummaryPageContent(
                  summaryData.find(data => data.Language === language.toUpperCase())
                );
              },
              'summarypageLanguageChange'
            );
          });
      });
    }
    if (!showPega) {
      setPageTitle();
    }
  }, [showResolutionPage, showPega]);

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
          appname={t('COB_SERVICE_HEADING')}
          handleSignout={handleSignout}
          languageToggleCallback={toggleNotificationProcess(
            { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' },
            assignmentPConn
          )}
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
          millisecondsTillSignout={millisecondsTillSignout}
        />
        <div className='govuk-width-container'>
          {!showPega && <StartPage handleStartCOB={handleStartCOB} />}
          <div id='pega-part-of-page'>
            <div id='pega-root'></div>
          </div>
          {showResolutionPage && (
            <SummaryPage
              summaryContent={summaryPageContent.Content}
              summaryTitle={summaryPageContent.Title}
              summaryBanner={summaryPageContent.Banner}
              backlinkProps={{}}
            />
          )}
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
