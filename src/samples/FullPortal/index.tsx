import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { compareSdkPCoreVersions } from '@pega/react-sdk-components/lib/components/helpers/versionHelpers';
import { loginIfNecessary, SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import localSdkComponentMap from '../../../sdk-local-component-map';
import PegaComponent from '../../components/PegaComponent';

declare const myLoadPortal: any;
declare const myLoadDefaultPortal: any;

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function FullPortal() {
  const [renderObj, setRenderObject] = useState({});
  const [pegaIsReady, setPegaIsReady] = useState(false);
  const history = useHistory();
  const query = useQuery();
  if (query.get('portal')) {
    const portalValue: any = query.get('portal');
    sessionStorage.setItem('rsdk_portalName', portalValue);
  }

  /**
   * Callback from onPCoreReady that's called once the top-level render object
   * is ready to be rendered
   * @param inRenderObj the initial, top-level PConnect object to render
   */

  /**
   * kick off the application's portal that we're trying to serve up
   */
  function startPortal() {
    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObject => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      // Initialize the SdkComponentMap (local and pega-provided)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      getSdkComponentMap(localSdkComponentMap).then((theComponentMap: any) => {
        // eslint-disable-next-line no-console
        console.log(`SdkComponentMap initialized`, theComponentMap);

        // Luke: must be set once the SdkComponentMap is initialized
        setRenderObject(renderObject);
        setPegaIsReady(true);
      });
    });

    // load the Portal and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    const thePortal = SdkConfigAccess.getSdkConfigServer().appPortal;
    const defaultPortal = PCore?.getEnvironmentInfo?.().getDefaultPortal?.();
    const queryPortal = sessionStorage.getItem('rsdk_portalName');
    // Note: myLoadPortal and myLoadDefaultPortal are set when bootstrapWithAuthHeader is invoked
    if (queryPortal) {
      myLoadPortal('outlet', queryPortal, []);
    } else if (thePortal) {
      // eslint-disable-next-line no-console
      console.log(`Loading specified appPortal: ${thePortal}`);
      myLoadPortal('outlet', thePortal, []);
    } else if (myLoadDefaultPortal && defaultPortal) {
      // eslint-disable-next-line no-console
      console.log(`Loading default portal`);
      myLoadDefaultPortal('outlet', []);
    } else {
      // This path of selecting a portal by enumerating entries within current user's access group's portals list
      //  relies on Traditional DX APIs and should be avoided when the Constellation bootstrap supports
      //  the loadDefaultPortal API
      SdkConfigAccess.selectPortal().then(() => {
        const selPortal = SdkConfigAccess.getSdkConfigServer().appPortal;
        myLoadPortal('outlet', selPortal, []); // this is defined in bootstrap shell that's been loaded already
      });
    }
  }

  function doRedirectDone() {
    history.push(window.location.pathname);
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({
      appName: 'portal',
      mainRedirect: true,
      locale: sessionStorage.getItem('rsdk_locale')
    });
    // possibly add locale here too
  }

  // One time (initialization)
  useEffect(() => {
    document.addEventListener('SdkConstellationReady', () => {
      // start the portal
      startPortal();
    });

    // Login if needed, without doing an initial main window redirect
    loginIfNecessary({ appName: 'portal', mainRedirect: true, redirectDoneCB: doRedirectDone });
  }, []);

  return <>{pegaIsReady && <PegaComponent {...renderObj} />}</>;
}
