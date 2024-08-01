import { getSdkConfig, logout } from '@pega/auth/lib/sdk-auth-manager';

export const scrollToTop = () => {
  const position = document.getElementById('#main-content')?.offsetTop || 0;
  document.body.scrollTop = position;
  document.documentElement.scrollTop = position;
};

export const GBdate = date => {
  const d = String(date).split('-');
  return d.length > 1 ? `${d[2]}/${d[1]}/${d[0]}` : date;
};

export const checkErrorMsgs = (errorMsgs = [], fieldIdentity = '', fieldElement = '') => {
  return errorMsgs.find(
    element =>
      element.message.fieldId === fieldIdentity || element.message.fieldId.startsWith(fieldElement)
  );
};

export const shouldRemoveFormTagForReadOnly = (pageName: string) => {
  const arrContainerNamesFormNotRequired = ['Your date of birth'];
  return arrContainerNamesFormNotRequired.includes(pageName);
};

export const getServiceShutteredStatus = async (): Promise<boolean> => {
  interface ResponseType {
    data: { Shuttered: boolean };
  }
  try {
    const sdkConfig = await getSdkConfig();
    const urlConfig = new URL(
      `${sdkConfig.serverConfig.infinityRestServerUrl}/app/${sdkConfig.serverConfig.appAlias}/api/application/v2/data_views/D_ShutterLookup`
    ).href;
    const featureID = 'SA';
    const featureType = 'Service';

    const parameters = new URLSearchParams(
      `{FeatureID: ${featureID}, FeatureType: ${featureType}}`
    );

    const url = `${urlConfig}?dataViewParameters=${parameters}`;
    const { invokeCustomRestApi } = PCore.getRestClient();
    /* eslint-disable */
    return invokeCustomRestApi(
      url,
      {
        method: 'GET',
        body: '',
        headers: '',
        withoutDefaultHeaders: false
      },
      ''
    )
      .then((response: ResponseType) => {
        return response.data.Shuttered;
      })
      .catch((error: Error) => {
        console.log(error);
        return false;
      });
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const isSingleEntity = (propReference: string, getPConnect) => {
  const containerName = getPConnect().getContainerName();
  const context = PCore.getContainerUtils().getActiveContainerItemContext(
    `${PCore.getConstants().APP.APP}/${containerName}`
  );

  const count = PCore.getStoreValue(
    propReference.split('[')[0],
    'caseInfo.content',
    context
  )?.length;

  if (typeof count !== 'undefined' && count === 1) return true;
};

// This method will remove redundant string separated by seperatorexport
export const removeRedundantString = (redundantString: string, separator: string = '.') => {
  const list = redundantString.split(separator);
  const newList = [];
  let uniqueString = '';
  const emailPattern = new RegExp(/\S+@\S+\.\S+/);
  const checkEmail = emailPattern.test(redundantString);
  if (list.length > 0) {
    list.forEach(item => {
      if (!newList.includes(item.trim())) {
        newList.push(item);
      }
    });
    if (newList.length > 0) {
      newList.forEach(element => {
        uniqueString =
          uniqueString + (uniqueString.length <= 0 ? '' : checkEmail ? '.' : '. ') + element.trim();
      });
    }
  }
  return uniqueString;
};

export const checkStatus = () => {
  const containername = PCore.getContainerUtils().getActiveContainerItemName(
    `${PCore.getConstants().APP.APP}/primary`
  );
  const context = PCore.getContainerUtils().getActiveContainerItemName(`${containername}/workarea`);
  const status = PCore.getStoreValue('.pyStatusWork', 'caseInfo.content', context);
  return status;
};

export const triggerLogout = setIsLogout => {
  let authType = 'gg';
  getSdkConfig().then(sdkConfig => {
    const sdkConfigAuth = sdkConfig.authConfig;
    authType = sdkConfigAuth.authService;
  });
  const authServiceList = {
    gg: 'GovGateway',
    'gg-dev': 'GovGateway-Dev',
    'gg-sa-dev': 'GovGateway-SA-dev'
  };
  const authService = authServiceList[authType];

  setIsLogout(true);

  // If the container / case is opened then close the container on signout to prevent locking.
  const activeCase = PCore.getContainerUtils().getActiveContainerItemContext('app/primary');
  if (activeCase) {
    PCore.getContainerUtils().closeContainerItem(activeCase, { skipDirtyCheck: true });
  }

  type responseType = { URLResourcePath2: string };

  PCore.getDataPageUtils()
    .getPageDataAsync('D_AuthServiceLogout', 'root', { AuthService: authService })
    // @ts-ignore
    .then((response: unknown) => {
      const logoutUrl = (response as responseType).URLResourcePath2;

      logout().then(() => {
        if (logoutUrl) {
          // Clear previous sessioStorage values
          sessionStorage.clear();
          window.location.href = logoutUrl;
        }
      });
    });
};

// This function check is to manipulate the continue button to "Save and continue"
// Becasue the manual address screen is having the button which is comign as "Continue" instead  "Save and continue"
// As this is common component andd used in otehr application the pega unable to chang it.
// So we have used this function and manipulating the button to "Save and continue"
export const isSaveAndContinueButton = () => {
  const primaryContainer = PCore.getContainerUtils().getActiveContainerItemContext(
    `${PCore.getConstants().APP.APP}/primary`
  );
  const containerName = PCore.getContainerUtils().getActiveContainerItemName(
    `${primaryContainer}/workarea`
  );
  const formFieldC11nEnv = PCore.getFormUtils().getEditableFields(containerName);
  if (formFieldC11nEnv?.length > 0) {
    const pageViewName =
      formFieldC11nEnv?.length === 1
        ? formFieldC11nEnv[0]?.fieldC11nEnv?.viewName
        : formFieldC11nEnv[formFieldC11nEnv?.length - 1]?.fieldC11nEnv?.viewName;
    const continueButtonPageNames = ['YourDetailsInstruction', 'DeclarationContent'];
    return !(continueButtonPageNames.indexOf(pageViewName) > -1);
  } else {
    return false;
  }
};

export const getWorkareaContainerName = () => {
  const primaryContainer = PCore.getContainerUtils().getActiveContainerItemContext(
    `${PCore.getConstants().APP.APP}/primary`
  );
  const containerName = PCore.getContainerUtils().getActiveContainerItemName(
    `${primaryContainer}/workarea`
  );
  return containerName;
};
