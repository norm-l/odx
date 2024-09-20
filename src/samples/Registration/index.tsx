// @ts-nocheck - TypeScript type checking to be added soon
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';

import {
  sdkIsLoggedIn,
  getSdkConfig
} from '@pega/auth/lib/sdk-auth-manager';

import { compareSdkPCoreVersions } from '@pega/react-sdk-components/lib/components/helpers/versionHelpers';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import LogoutPopup from '../../components/AppComponents/LogoutPopup';

import ConfirmationPage from './ConfirmationPage';
import UserPortal from './UserPortal';
import AskHMRC from './AskHMRC';
import RegistrationDetails from '../../components/templates/RegistrationDetails';
import setPageTitle, { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';

import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import localSdkComponentMap from '../../../sdk-local-component-map';
import { checkCookie, setCookie } from '../../components/helpers/cookie';
import ShutterServicePage from '../../components/AppComponents/ShutterServicePage';
import toggleNotificationProcess from '../../components/helpers/toggleNotificationLanguage';
import { triggerLogout, checkStatus } from '../../components/helpers/utils';
import RegistrationAgeRestrictionInfo from './RegistrationAgeRestrictionInfo';
import AlreadyRegisteredUserMessage from './AlreadyRegisteredUserMessage';
import ApiServiceNotAvailable from '../../components/AppComponents/ApiErrorServiceNotAvailable';

declare const myLoadMashup: any;
/* Time out modal functionality */
let applicationTimeout = null;
let signoutTimeout = null;
// Sets default timeouts (13 mins for warning, 115 seconds for sign out after warning shows)
let milisecondsTilSignout = 115 * 1000;
let milisecondsTilWarning = 780 * 1000;

// Clears any existing timeouts and starts the timeout for warning, after set time shows the modal and starts signout timer
function initTimeout(setShowTimeoutModal, setIsLogout) {
  clearTimeout(applicationTimeout);
  clearTimeout(signoutTimeout);

  applicationTimeout = setTimeout(() => {
    setShowTimeoutModal(true);
    signoutTimeout = setTimeout(() => {
      triggerLogout(setIsLogout);
    }, milisecondsTilSignout);
  }, milisecondsTilWarning);
}

// Sends 'ping' to pega to keep session alive and then initiates the timout
function staySignedIn(setShowTimeoutModal, setIsLogout, refreshSignin = true) {
  if (refreshSignin) {
    PCore.getDataPageUtils().getDataAsync('D_RegistrantWorkAssignmentSACases', 'root');
  }
  setShowTimeoutModal(false);
  initTimeout(setShowTimeoutModal, setIsLogout);
}
/* ******************************* */

export default function Registration() {
  const [pConn, setPConn] = useState<any>(null);
  const [bShowPega, setShowPega] = useState(false);
  const [showUserPortal, setShowUserPortal] = useState(false);
  const [bShowAppName, setShowAppName] = useState(false);
  const [bShowResolutionScreen, setShowResolutionScreen] = useState(false);
  // const [loadingInProgressRegistration, setLoadingInProgressRegistration] = useState(true);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [serviceNotAvailable, setServiceNotAvailable] = useState(false);
  const [shutterServicePage, setShutterServicePage] = useState(false);
  const [showPortalBanner, setShowPortalBanner] = useState(false);
  const [assignmentPConn, setAssignmentPConn] = useState(null);
  const [inprogressRegistration, setInprogressRegistration] = useState([]);
  const [showAgeRestrictionInfo, setshowAgeRestrictionInfo] = useState(false);
  const [showAlreadyRegisteredUserMessage, setShowAlreadyRegisteredUserMessage] = useState(false);
  const [isSoleTrader, setIsSoleTrader] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();
  // This needs to be changed in future when we handle the shutter for multiple service, for now this one's for single service
  const featureID = 'SA';
  const featureType = 'Service';
  const caseStatusForRestrictedUser = 'resolved-rejectedvulnerable';
  const caseStatusForAlreadyRegisteredUser = 'resolved-rejectedutrexists';

  function resetAppDisplay() {
    setShowUserPortal(false);
    setShowResolutionScreen(false);
    setShowPega(false);
    setshowAgeRestrictionInfo(false);
    setShowAlreadyRegisteredUserMessage(false);
  }

  function displayPega() {
    resetAppDisplay();
    setShowPega(true);
  }

  function displayUserPortal() {
    resetAppDisplay();
    setShowUserPortal(true);
  }

  function displayServiceNotAvailable() {
    setServiceNotAvailable(true);
  }

  function displayResolutionScreen() {
    resetAppDisplay();
    setShowResolutionScreen(true);
  }

  function displayShowAgeRestrictionInfo() {
    resetAppDisplay();
    setshowAgeRestrictionInfo(true);
  }

  function displayShowAlreadyRegisteredUserMessage() {
    resetAppDisplay();
    setShowAlreadyRegisteredUserMessage(true);
  }

  const serviceName = t('REGISTER_FOR_SELF_ASSESSMENT');
  registerServiceName(serviceName);
  useEffect(() => {
    setPageTitle();
  }, [showUserPortal, bShowPega, bShowResolutionScreen, serviceName]);
  function createCase() {
    displayPega();

    let startingFields = {};
    startingFields = {
      //  NotificationLanguage: sessionStorage.getItem('rsdk_locale')?.slice(0, 2) || 'en'
    };
    PCore.getMashupApi()
      .createCase('HMRC-SA-Work-Registration', PCore.getConstants().APP.APP, {
        startingFields
      })
      .then(() => {
        const status = checkStatus();
        if (status?.toLowerCase() === caseStatusForRestrictedUser) {
          displayShowAgeRestrictionInfo();
        } else if (status?.toLowerCase() === caseStatusForAlreadyRegisteredUser) {
          displayShowAlreadyRegisteredUserMessage();
        }
      });
  }

  function getIsSoleTrader() {
    const context = PCore.getContainerUtils().getActiveContainerItemName(
      `${PCore.getConstants().APP.APP}/primary`
    );

    const caseId = PCore.getStoreValue('.ID', 'caseInfo', context);

    PCore.getDataPageUtils()
      .getPageDataAsync('D_RegistrantCaseInfoDetails', 'root', { caseId })
      .then(resp => {
        setIsSoleTrader(resp?.IsSoleTrader);
      });
  }

  function assignmentFinished() {
    if (!bShowResolutionScreen) {
      getIsSoleTrader();

      PCore.getContainerUtils().closeContainerItem(
        PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
        { skipDirtyCheck: true }
      );
    }

    displayResolutionScreen();
  }

  function closeContainer() {
    displayUserPortal();
  }

  // Calls data page to fetch in progress registration,
  // This then sets inprogress registration state value to the registration details.
  // This funtion also sets 'isloading' value to true before making d_page calls
  function fetchInProgressRegistrationData() {
    // setLoadingInProgressRegistration(true);
    let inProgressRegData: any = [];
    // @ts-ignore
    PCore.getDataPageUtils()
      .getDataAsync('D_RegistrantWorkAssignmentSACases', 'root')
      .then(resp => {
        if (!resp.resultCount) {
          createCase();
        } else {
          resp = resp.data.slice(0, 10);
          inProgressRegData = resp;
          setInprogressRegistration(inProgressRegData);
        }
        // setLoadingInProgressRegistration(false);
      });
    sessionStorage.setItem('assignmentFinishedFlag', 'false');
  }

  function cancelAssignment() {
    fetchInProgressRegistrationData();
    displayUserPortal();
    PCore.getContainerUtils().closeContainerItem(
      PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
      { skipDirtyCheck: true }
    );
  }

  function establishPCoreSubscriptions() {
    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING,
      () => {
        assignmentFinished();
      },
      'assignmentFinished'
    );
    PCore.getPubSubUtils().subscribe(
      'assignmentFinished',
      () => {
        const assignmentFinishedFlag = sessionStorage.getItem('assignmentFinishedFlag');
        if (assignmentFinishedFlag !== 'true') {
          setShowUserPortal(false);
          setShowPega(false);
          const containername = PCore.getContainerUtils().getActiveContainerItemName(
            `${PCore.getConstants().APP.APP}/primary`
          );
          const context = PCore.getContainerUtils().getActiveContainerItemName(
            `${containername}/workarea`
          );
          const status = PCore.getStoreValue('.pyStatusWork', 'caseInfo.content', context);

          if (status === 'Resolved-Discarded') {
            displayServiceNotAvailable();

            PCore.getContainerUtils().closeContainerItem(context);

            sessionStorage.setItem('assignmentFinishedFlag', 'true');
            PCore?.getPubSubUtils().unsubscribe(
              PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING,
              'assignmentFinished'
            );
          }
        }
      },
      'assignmentFinished'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => {
        cancelAssignment();
        setShowPortalBanner(true);
      },
      'cancelAssignment'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
      () => {
        closeContainer();
      },
      'closeContainer'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.ASSIGNMENT_OPENED,
      () => {
        displayPega();
      },
      'continueAssignment'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_CREATED,
      () => {
        displayPega();
      },
      'continueCase'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CREATE_STAGE_SAVED,
      () => {
        cancelAssignment();
        setShowPortalBanner(true);
      },
      'savedCase'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_OPENED,
      () => {
        displayPega();
      },
      'continueCase'
    );
  }

  useEffect(() => {
    if (!sdkIsLoggedIn()) {
      // login();     // Login now handled at TopLevelApp
    } else {
      setShowUserPortal(true);
    }
  }, [bShowAppName]);

  // from react_root.js with some modifications
  function RootComponent(props) {
    const PegaConnectObj = createPConnectComponent();
    const thePConnObj = <PegaConnectObj {...props} />;

    const theComp = (
      <StoreContext.Provider
        value={{
          store: PCore.getStore(),
          displayOnlyFA: true,
          isMashup: true,
          setAssignmentPConnect: setAssignmentPConn
        }}
      >
        {thePConnObj}
      </StoreContext.Provider>
    );

    return theComp;
  }

  /**
   * Callback from onPCoreReady that's called once the top-level render object
   * is ready to be rendered
   * @param inRenderObj the initial, top-level PConnect object to render
   */
  function initialRender(inRenderObj) {
    // loadMashup does its own thing so we don't need to do much/anything here
    // // modified from react_root.js render
    const {
      props,
      domContainerID = null,
      componentName,
      portalTarget,
      styleSheetTarget
    } = inRenderObj;

    const thePConn = props.getPConnect();

    setPConn(thePConn);

    let target: any = null;

    if (domContainerID !== null) {
      target = document.getElementById(domContainerID);
    } else if (portalTarget !== null) {
      target = portalTarget;
    }

    // Note: RootComponent is just a function (declared below)
    const Component: any = RootComponent;

    if (componentName) {
      Component.displayName = componentName;
    }

    const theComponent = (
      <Component {...props} portalTarget={portalTarget} styleSheetTarget={styleSheetTarget} />
    );

    // Initial render of component passed in (which should be a RootContainer)
    render(<React.Fragment>{theComponent}</React.Fragment>, target);
  }

  /**
   * kick off the application's portal that we're trying to serve up
   */
  function startMashup() {
    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObj => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();
      establishPCoreSubscriptions();
      setShowAppName(true);

      // Fetches timeout length config
      getSdkConfig()
        .then(sdkConfig => {
          if (sdkConfig.timeoutConfig.secondsTilWarning)
            milisecondsTilWarning = sdkConfig.timeoutConfig.secondsTilWarning * 1000;
          if (sdkConfig.timeoutConfig.secondsTilLogout)
            milisecondsTilSignout = sdkConfig.timeoutConfig.secondsTilLogout * 1000;
        })
        .finally(() => {
          // Subscribe to any store change to reset timeout counter
          PCore.getStore().subscribe(() => staySignedIn(setShowTimeoutModal, setIsLogout, false));
          initTimeout(setShowTimeoutModal, setIsLogout);
        });

      // TODO : Consider refactoring 'en_GB' reference as this may need to be set elsewhere
      PCore.getEnvironmentInfo().setLocale(sessionStorage.getItem('rsdk_locale') || 'en_GB');
      // PCore.getLocaleUtils().resetLocaleStore();
      // PCore.getLocaleUtils().loadLocaleResources([
      //   PCore.getLocaleUtils().GENERIC_BUNDLE_KEY,
      //   '@BASECLASS!DATAPAGE!D_LISTREFERENCEDATABYTYPE'
      // ]);
      initialRender(renderObj);

      // operatorId = PCore.getEnvironmentInfo().getOperatorIdentifier();

      /* Functionality to set the device id in the header for use in CIP.
      Device id is unique and will be stored on the user device / browser cookie */
      const COOKIE_PEGAODXDI = 'pegaodxdi';
      let deviceID = checkCookie(COOKIE_PEGAODXDI);
      if (deviceID) {
        setCookie(COOKIE_PEGAODXDI, deviceID, 3650);
        PCore.getRestClient().getHeaderProcessor().registerHeader('deviceid', deviceID);
      } else {
        PCore.getDataPageUtils()
          .getPageDataAsync('D_UserSession', 'root')
          .then(res => {
            deviceID = res.DeviceId;
            setCookie(COOKIE_PEGAODXDI, deviceID, 3650);
            PCore.getRestClient().getHeaderProcessor().registerHeader('deviceid', deviceID);
          });
      }
      fetchInProgressRegistrationData();
    });

    // Initialize the SdkComponentMap (local and pega-provided)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    getSdkComponentMap(localSdkComponentMap).then((theComponentMap: any) => {
      // eslint-disable-next-line no-console
      console.log(`SdkComponentMap initialized`);
    });
    PCore.getDataPageUtils()
      .getPageDataAsync('D_ShutterLookup', 'root', {
        FeatureID: featureID,
        FeatureType: featureType
      })
      .then(resp => {
        const isShuttered = resp.Shuttered;
        if (isShuttered) {
          setShutterServicePage(true);
          resetAppDisplay();
        } else {
          setShutterServicePage(false);
          displayUserPortal();
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });

    // load the Mashup and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    myLoadMashup('pega-root', false); // this is defined in bootstrap shell that's been loaded already
  }

  // One time (initialization) subscriptions and related unsubscribe
  useEffect(() => {
    document.addEventListener('SdkConstellationReady', () => {
      // start the portal
      startMashup();
    });

    // Subscriptions can't be done until onPCoreReady.
    //  So we subscribe there. But unsubscribe when this
    //  component is unmounted (in function returned from this effect)

    return function cleanupSubscriptions() {
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
        'cancelAssignment'
      );
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.ASSIGNMENT_OPENED,
        'continueAssignment'
      );
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CASE_OPENED,
        'continueCase'
      );

      PCore?.getPubSubUtils().unsubscribe('closeContainer');
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING,
        'assignmentFinished'
      );
    };
  }, []);

  function handleSignout() {
    if (bShowPega) {
      setShowSignoutModal(true);
    } else {
      triggerLogout(setIsLogout);
    }
  }

  const handleStaySignIn = e => {
    e.preventDefault();
    setShowSignoutModal(false);
    // Extends manual signout popup 'stay signed in' to reset the automatic timeout timer also
    staySignedIn(setShowTimeoutModal, setIsLogout);
  };

  const renderContent = () => {
    if (serviceNotAvailable) {
      return <ApiServiceNotAvailable />;
    } else if (shutterServicePage) {
      return <ShutterServicePage />;
    } else if (showAgeRestrictionInfo) {
      return <RegistrationAgeRestrictionInfo />;
    } else if (showAlreadyRegisteredUserMessage) {
      return <AlreadyRegisteredUserMessage />;
    } else {
      return (
        <>
          <div id='pega-part-of-page' className={isLogout ? 'visibility-hidden' : ''}>
            <div id='pega-root'></div>
          </div>
          {showUserPortal && (
            <UserPortal showPortalBanner={showPortalBanner} isLogout={isLogout}>
              {inprogressRegistration.length > 0 && (
                <>
                  <RegistrationDetails
                    thePConn={pConn}
                    data={inprogressRegistration}
                    rowClickAction='OpenAssignment'
                    buttonContent={t('CONTINUE_YOUR_REGISTRATION')}
                  />
                  <AskHMRC />
                </>
              )}
            </UserPortal>
          )}
        </>
      );
    }
  };

  return (
    <>
      <TimeoutPopup
        show={showTimeoutModal}
        staySignedinHandler={() => staySignedIn(setShowTimeoutModal, setIsLogout)}
        signoutHandler={() => {
          triggerLogout(setIsLogout);
        }}
        isAuthorised
      />

      <AppHeader
        handleSignout={handleSignout}
        appname={t('REGISTER_FOR_SELF_ASSESSMENT')}
        hasLanguageToggle
        isPegaApp={bShowPega}
        languageToggleCallback={toggleNotificationProcess(
          { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' },
          assignmentPConn
        )}
      />
      <div className='govuk-width-container'>
        {renderContent()}
        {bShowResolutionScreen && <ConfirmationPage isSoleTrader={isSoleTrader} />}
      </div>

      <LogoutPopup
        show={showSignoutModal && !showTimeoutModal}
        hideModal={() => setShowSignoutModal(false)}
        handleSignoutModal={() => {
          triggerLogout(setIsLogout);
        }}
        handleStaySignIn={handleStaySignIn}
      />
      <AppFooter />
    </>
  );
}
