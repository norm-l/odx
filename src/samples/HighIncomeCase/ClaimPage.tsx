import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';
import AppHeader from './reuseables/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import ShutterServicePage from '../../components/AppComponents/ShutterServicePage';
import ServiceNotAvailable from '../../components/AppComponents/ServiceNotAvailable';
import LogoutPopup from '../../components/AppComponents/LogoutPopup';
import { loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';
import { staySignedIn } from '../../components/AppComponents/TimeoutPopup/timeOutUtils';
import { useStartMashup } from './reuseables/PegaSetup';
import {
  initTimeout,
  settingTimer
} from '../../components/AppComponents/TimeoutPopup/timeOutUtils';
import SummaryPage from '../../components/AppComponents/SummaryPage';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import { triggerLogout } from '../../components/helpers/utils';
import AppContext from './reuseables/AppContext';
import toggleNotificationProcess from '../../components/helpers/toggleNotificationLanguage';

// declare const myLoadMashup;
declare const PCore:any;
let milisecondsTilSignout = 115*1000;

const ClaimPage: FunctionComponent<any> = () => {
    // const [bShowPega, setShowPega] = useState(false);
    const [shutterServicePage, /* setShutterServicePage */] = useState(false);
    const [serviceNotAvailable, /* setServiceNotAvailable */] = useState(false);
    const [pCoreReady, setPCoreReady] = useState(false);
    const {showLanguageToggle} = useContext(AppContext);

    const setAuthType = useState('gg')[1];

    const [currentDisplay, setCurrentDisplay] = useState<|'pegapage'|'resolutionpage'|'servicenotavailable'|'shutterpage'|'loading'>('pegapage');
    // Holds relevant summary page content (specific language)
    const [summaryPageContent, setSummaryPageContent] = useState<any>({content:null, title:null, banner:null})    
    const { t } = useTranslation();
    
    const history = useHistory();

    const [showTimeoutModal, setShowTimeoutModal] = useState(false);  
    const [showSignoutModal, setShowSignoutModal] = useState(false);

    const { hmrcURL } = useHMRCExternalLinks();

    useEffect(() => 
        {
          initTimeout(setShowTimeoutModal, false, true, false)         
        }        
    , []);    
    
    function doRedirectDone() {
        history.replace('/hicbc/opt-in');
        // appName and mainRedirect params have to be same as earlier invocation
        loginIfNecessary({ appName: 'embedded', mainRedirect: true });        
    } 

    const { showPega, setShowPega, showResolutionPage, caseId, assignmentPConn} = useStartMashup(setAuthType, doRedirectDone, {appBacklinkProps:{}});
    
    
    useEffect(() => {
      if(showPega){setCurrentDisplay('pegapage')}
      else if(showResolutionPage){
        setCurrentDisplay('resolutionpage')
        getSdkConfig().then((config)=>{          
          PCore.getRestClient().invokeCustomRestApi(
            `${config.serverConfig.infinityRestServerUrl}/api/application/v2/cases/${caseId}?pageName=SubmissionSummary`,
            {
              method: 'GET',
              body: '',
              headers: '',
              withoutDefaultHeaders: false,
            },
            '')
            .then((response) => {     
              PCore.getPubSubUtils().unsubscribe('languageToggleTriggered', 'summarypageLanguageChange');
              const summaryData:Array<any> = response.data.data.caseInfo.content.ScreenContent.LocalisedContent;
              /* const summaryData={
                en:{content:'English content', title: 'English Title', banner:null},
                cy:{content:'Welsh content', banner: 'Welsh Banner', title:null},
              } */
              // setSummaryPageData(summaryData); 
              const currentLang = sessionStorage.getItem('rsdk_locale')?.slice(0,2).toUpperCase() || 'EN';

              setSummaryPageContent(summaryData.find(data => data.Language === currentLang));                              

              PCore.getPubSubUtils().subscribe('languageToggleTriggered', ({language}) => {
                setSummaryPageContent(summaryData.find(data => data.Language === language.toUpperCase()));             
              }, 'summarypageLanguageChange');
            })
      })}
      else if(shutterServicePage){setCurrentDisplay('shutterpage')}      
      else if(serviceNotAvailable){setCurrentDisplay('servicenotavailable')}
      else {
        setCurrentDisplay('loading');
      }
      if(!showPega){ setPageTitle(); }

    }, [showResolutionPage, showPega, shutterServicePage, serviceNotAvailable, pCoreReady])

  

  function handleSignout() {
        if (currentDisplay==='pegapage') {
          setShowSignoutModal(true);
        } else {
          triggerLogout();
        }
  }  

  const handleStaySignIn = e => {
    e.preventDefault();
    setShowSignoutModal(false);
    // Extends manual signout popup 'stay signed in' to reset the automatic timeout timer also
    staySignedIn(setShowTimeoutModal, "D_ClaimantSubmittedChBCases", null, null);
  };

  const startClaim = () => {
    setShowPega(true);
    PCore.getMashupApi().createCase('HMRC-ChB-Work-HICBCPreference', PCore.getConstants().APP.APP);
  };

  /* ***
   * Application specific PCore subscriptions
   *
   * TODO Can this be made into a tidy helper? including its own clean up? A custom hook perhaps
   */  

  // And clean up

  useEffect(() => {
    getSdkConfig()
        .then(sdkConfig => {
          if (sdkConfig.timeoutConfig.secondsTilLogout)
            milisecondsTilSignout = sdkConfig.timeoutConfig.secondsTilLogout * 1000;
        })
      
    document.addEventListener('SdkConstellationReady', () => {
      PCore.onPCoreReady(() => {
        if(!pCoreReady){
          setPCoreReady(true);
          PCore.getPubSubUtils().subscribe(
            PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
            () => {
              // console.log("SUBEVENT!!! showStartPageOnCloseContainerItem")
              setShowPega(false);
            },
            'showStartPageOnCloseContainerItem'
          );
          startClaim();
        }
      });
      settingTimer();
    });
    
    return () => {
      PCore.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
        'showStartPageOnCloseContainerItem'
      );
    };
  }, []);

    /* ***
     * Application specific PCore subscriptions
     * 
     * TODO Can this be made into a tidy helper? including its own clean up? A custom hook perhaps 
     */
    document.addEventListener('SdkConstellationReady', () => {
        PCore.onPCoreReady(() => {        
        PCore.getPubSubUtils().subscribe(
            PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
            () => {
                // console.log("SUBEVENT!!! showStartPageOnCloseContainerItem")
                setShowPega(false);
            },
            'showStartPageOnCloseContainerItem'
        );
        })
        settingTimer();
        PCore.getStore().subscribe(() => staySignedIn(setShowTimeoutModal, '', null, true, false));        
    }); 
    
    // And clean up

    useEffect(() => {
        return () => {
            PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,'showStartPageOnCloseContainerItem')
        }
    }, [])


    return ( <>
      <TimeoutPopup
        show={showTimeoutModal}
        staySignedinHandler={() =>
          staySignedIn(setShowTimeoutModal, 'D_ClaimantWorkAssignmentChBCases')
        }
        signoutHandler={triggerLogout}
        isAuthorised={false}  
        signoutButtonText={t("SIGN-OUT")}
        staySignedInButtonText={t("STAY_SIGNED_IN")}
        milisecondsTilSignout={milisecondsTilSignout}
      >
      </TimeoutPopup>

      <AppHeader
        handleSignout={handleSignout}
        appname={t('HICBC_APP_NAME')}
        hasLanguageToggle={showLanguageToggle}
        isPegaApp={showPega}
        languageToggleCallback={
          toggleNotificationProcess(
          { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' },
          assignmentPConn 
          )}
        betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=463&referrerUrl=${window.location}`}    
      />
      <div className='govuk-width-container'>
        {shutterServicePage ? (
          <ShutterServicePage />
        ) : (
          <>
            <div id='pega-part-of-page'>
              <div id='pega-root'></div>
            </div>
            { serviceNotAvailable && <ServiceNotAvailable /> }            
            { currentDisplay === 'resolutionpage' && <SummaryPage summaryContent={
              summaryPageContent.Content}
              summaryTitle={summaryPageContent.Title}
              summaryBanner={summaryPageContent.Banner}
              backlinkProps={{}}  
            />}        
          </>
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
        <p className='govuk-body'>{t('IF_YOU_SIGN_OUT_NOW_PROGRESS_WILL_BE_LOST')}</p>
      </LogoutPopup>
      <AppFooter />
    </>
  );
};

export default ClaimPage;
