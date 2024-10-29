import React, { useEffect, useState } from 'react';

// import { useHistory } from 'react-router-dom';
import { render } from 'react-dom';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import { compareSdkPCoreVersions } from '@pega/react-sdk-components/lib/components/helpers/versionHelpers';
import { getSdkConfig, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';
import { checkCookie, setCookie } from '../../../components/helpers/cookie';
import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import localSdkComponentMap from '../../../../sdk-local-component-map';
import AppContext, { AppContextValues } from './AppContext';

import {
  // sdkIsLoggedIn,
  loginIfNecessary,
  sdkSetAuthHeader
} from '@pega/auth/lib/sdk-auth-manager';
import RunTensCheck from '../../../services/TensCheckService';

declare const myLoadMashup: any;

export function establishPCoreSubscriptions({
  setShowPega,
  setShowResolutionPage,
  setCaseId,
  setCaseStatus
}) {
  /* ********************************************
   * Registers close active container on end of assignment processing
   ********************************************* */
  function showResolutionScreen() {
    // PM!! getClaimsCaseID();
    const context = PCore.getContainerUtils().getActiveContainerItemName(
      `${PCore.getConstants().APP.APP}/primary`
    );
    const status = PCore.getStoreValue('.status', 'caseInfo', context);
    const id = PCore.getStoreValue('.ID', 'caseInfo', context);
    setCaseStatus(status);
    setCaseId(id);
    // console.log('SUBEVENT! closeActiveContainerOnEndOfAssignment');
    PCore.getContainerUtils().closeContainerItem(
      PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
      { skipDirtyCheck: true }
    );
    setShowResolutionPage(true);
  }
  /* *********************************************
   * closes container item if case is resolved-discarded, on assignmentFinished
   ******************************************** */
  function handleServiceNotAvailable() {
    // console.log('SUBEVENT! handleServiceNotAvailableOnAssignmentFinished');
    const containername = PCore.getContainerUtils().getActiveContainerItemName(
      `${PCore.getConstants().APP.APP}/primary`
    );
    const context = PCore.getContainerUtils().getActiveContainerItemName(
      `${containername}/workarea`
    );
    const status = PCore.getStoreValue('.pyStatusWork', 'caseInfo.content', context);
    if (status === 'Resolved-Discarded') {
      // PM!! displayServiceNotAvailable();
      PCore.getContainerUtils().closeContainerItem(context);
    } else {
      showResolutionScreen();
    }
  }

  PCore.getPubSubUtils().subscribe(
    'assignmentFinished',
    handleServiceNotAvailable,
    'handleServiceNotAvailableOnAssignmentFinished'
  );

  /* ********************************
   * On Cancel event, ?
   ******************************** */
  PCore.getPubSubUtils().subscribe(
    PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
    () => {
      // PM!! cancelAssignment();
      // PM!! setShowPortalBanner(true);
      // PM!! setIsCreateCaseBlocked(false);
    },
    'cancelAssignment'
  );

  /* ********************************
   * On close container event, ?
   ******************************** */
  PCore.getPubSubUtils().subscribe(
    PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
    () => {},
    'closeContainer'
  );

  /* ********************************
   * On assignment opened, toggle show pega
   ******************************** */
  PCore.getPubSubUtils().subscribe(
    PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.ASSIGNMENT_OPENED,
    () => {
      // console.log("SUBEVENT!! showPegaWhenAssignmentOpened")
      setShowPega(true);
    },
    'showPegaWhenAssignmentOpened'
  );

  /* ********************************
   * On case created, toggle show pega
   ******************************** */
  PCore.getPubSubUtils().subscribe(
    PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_CREATED,
    () => {
      // console.log("SUBEVENT!! showPegaWhenCaseCreated")
      setShowPega(true);
    },
    'showPegaWhenCaseCreated'
  );

  PCore.getPubSubUtils().subscribe(
    PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CREATE_STAGE_SAVED,
    () => {
      // PM!! cancelAssignment();
      // PM!! setShowPortalBanner(true);
      // PM!! setIsCreateCaseBlocked(false);
      // console.log('SUBEVENT!!! savedCase');
    },
    'savedCase'
  );

  PCore.getPubSubUtils().subscribe(
    PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_OPENED,
    () => {
      // PM!! displayPega();
    },
    'continueCase'
  );
}

/* ****
 * Defines the Root Component used in pega mashup
 *
 * DXAPI Note, has been extended to accept further context values
 *
 *  */

export function RootComponent(props) {
  const PegaConnectObj = createPConnectComponent();
  const thePConnObj = <PegaConnectObj {...props} />;

  // NOTE: For Embedded mode, we add in displayOnlyFA and isMashup to our React context
  // so the values are available to any component that may need it.
  const theComp = (
    <StoreContext.Provider
      value={{
        store: PCore.getStore(),
        displayOnlyFA: true,
        isMashup: true,
        ...props.contextExtensionValues
      }}
    >
      {thePConnObj}
    </StoreContext.Provider>
  );

  return theComp;
}

/* *
 * Callback from onPCoreReady that's called once the top-level render object
 * is ready to be rendered
 * @param inRenderObj the initial, top-level PConnect object to render
 */
function initialRender(inRenderObj, setAssignmentPConnect, _AppContextValues: AppContextValues) {
  // loadMashup does its own thing so we don't need to do much/anything here
  // // modified from react_root.js render
  const {
    props,
    domContainerID = null,
    componentName,
    portalTarget,
    styleSheetTarget
  } = inRenderObj;

  // const thePConn = props.getPConnect();

  // PM!! setPConn(thePConn);

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
    <Component
      {...props}
      portalTarget={portalTarget}
      styleSheetTarget={styleSheetTarget}
      contextExtensionValues={{ setAssignmentPConnect }}
    />
  );

  // Initial render of component passed in (which should be a RootContainer)
  render(
    <AppContext.Provider value={_AppContextValues}>
      <React.Fragment>{theComponent}</React.Fragment>
    </AppContext.Provider>,
    target
  );

  /* const root = render(target); // createRoot(container!) if you use TypeScript
    root.render(<>{theComponent}</>); */

  // Initial render to show that we have a PConnect and can render in the target location
  // render( <div>EmbeddedTopLevel initialRender in {domContainerID} with PConn of {componentName}</div>, target);
}

/*
 * kick off the application's portal that we're trying to serve up
 */
export function startMashup(
  { setShowPega, setShowResolutionPage, setCaseId, setCaseStatus, setAssignmentPConnect },
  _AppContextValues: AppContextValues
) {
  // NOTE: When loadMashup is complete, this will be called.
  PCore.onPCoreReady(renderObj => {
    // Check that we're seeing the PCore version we expect
    compareSdkPCoreVersions();
    establishPCoreSubscriptions({ setShowPega, setShowResolutionPage, setCaseId, setCaseStatus });
    // PM!! setShowAppName(true);

    // Fetches timeout length config
    // PM!!
    /* getSdkConfig()
        .then(sdkConfig => {
          if (sdkConfig.timeoutConfig.secondsTilWarning)
            millisecondsTillWarning= sdkConfig.timeoutConfig.secondsTilWarning * 1000;
          if (sdkConfig.timeoutConfig.secondsTilLogout)
            millisecondsTillSignout = sdkConfig.timeoutConfig.secondsTilLogout * 1000;
          if (sdkConfig.timeoutConfig.secondsTillStartNowUnblocked)
            secondsTillStartNowUnblocked =
              sdkConfig.timeoutConfig.secondsTillStartNowUnblocked * 1000;
        })
        .finally(() => {
          // Subscribe to any store change to reset timeout counter
          PCore.getStore().subscribe(() => staySignedIn(setShowTimeoutModal, false));
          initTimeout(setShowTimeoutModal);
        });
        */

    PCore.getEnvironmentInfo().setLocale(sessionStorage.getItem('rsdk_locale') || 'en_GB');

    initialRender(renderObj, setAssignmentPConnect, _AppContextValues);

    // PM!! operatorId = PCore.getEnvironmentInfo().getOperatorIdentifier();

    /* Functionality to set the device id in the header for use in CIP.
      Device id is unique and will be stored on the user device / browser cookie */
    const COOKIE_PEGAODXDI = 'pegaodxdi';
    let deviceID = checkCookie(COOKIE_PEGAODXDI);
    if (deviceID) {
      setCookie(COOKIE_PEGAODXDI, deviceID, 3650);
      PCore.getRestClient().getHeaderProcessor().registerHeader('deviceid', deviceID);
    } else {
      // @ts-ignore
      const dpagepromise = PCore.getDataPageUtils().getPageDataAsync(
        'D_UserSession',
        'root'
      ) as Promise<any>;
      dpagepromise.then(res => {
        deviceID = res.DeviceId;
        setCookie(COOKIE_PEGAODXDI, deviceID, 3650);
        PCore.getRestClient().getHeaderProcessor().registerHeader('deviceid', deviceID);
      });
    }
  });

  // Initialize the SdkComponentMap (local and pega-provided)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  getSdkComponentMap(localSdkComponentMap).then((theComponentMap: any) => {
    // eslint-disable-next-line no-console
    console.log(`SdkComponentMap initialized`);
  });

  // load the Mashup and handle the onPCoreEntry response that establishes the
  //  top level Pega root element (likely a RootContainer)

  myLoadMashup('pega-root', false); // this is defined in bootstrap shell that's been loaded already
}

// One time (initialization) subscriptions and related unsubscribe
export const useStartMashup = (
  setAuthType,
  onRedirectDone,
  _AppContextValues: AppContextValues
) => {
  const [showPega, setShowPega] = useState(false);
  const [showResolutionPage, setShowResolutionPage] = useState(false);
  const [caseId, setCaseId] = useState('');
  const [caseStatus, setCaseStatus] = useState('');
  const [assignmentPConn, setAssignmentPConnect] = useState(null);

  useEffect(() => {
    getSdkConfig().then(sdkConfig => {
      const sdkConfigAuth = sdkConfig.authConfig;
      setAuthType(sdkConfigAuth.authService);
      if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'Basic') {
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(
          `${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`
        );
        sdkSetAuthHeader(`Basic ${sB64}`);
      }

      if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'BasicTO') {
        const now = new Date();
        const expTime = new Date(now.getTime() + 5 * 60 * 1000);
        let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
        const regex = /[-:]/g;
        sISOTime = sISOTime.replace(regex, '');
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(
          `${sdkConfigAuth.mashupUserIdentifier}:${window.atob(
            sdkConfigAuth.mashupPassword
          )}:${sISOTime}`
        );
        sdkSetAuthHeader(`Basic ${sB64}`);
      }

      // Login if needed, without doing an initial main window redirect
      loginIfNecessary({ appName: 'embedded', mainRedirect: true, redirectDoneCB: onRedirectDone });
    });

    document.addEventListener('SdkConstellationReady', () => {
      // start the portal
      startMashup(
        { setShowPega, setShowResolutionPage, setCaseId, setCaseStatus, setAssignmentPConnect },
        _AppContextValues
      );
    });

    // Subscriptions can't be done until onPCoreReady.
    //  So we subscribe there. But unsubscribe when this
    //  component is unmounted (in function returned from this effect)

    return function cleanupSubscriptions() {
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
        'cancelAssignment'
      );
    };
  }, []);

  useEffect(() => {
    if (sdkIsLoggedIn()) {
      RunTensCheck().then((tensCheckHasRan: boolean) => {
        console.log('tensCheckHasRan', tensCheckHasRan);
        setShowResolutionPage(true);
      });
    }
  }, [showPega]);

  return {
    showPega,
    setShowPega,
    showResolutionPage,
    setShowResolutionPage,
    caseId,
    caseStatus,
    assignmentPConn
  };
};
