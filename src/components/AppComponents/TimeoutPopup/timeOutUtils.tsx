import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import { triggerLogout } from '../../helpers/utils';

let milisecondsTilWarning = 780 * 1000;
let milisecondsTilSignout = 115 * 1000;

export const settingTimer = async () => {
  const sdkConfig = await getSdkConfig();
  if (sdkConfig.timeoutConfig.secondsTilWarning)
    milisecondsTilWarning = sdkConfig.timeoutConfig.secondsTilWarning * 1000;
  if (sdkConfig.timeoutConfig.secondsTilLogout)
    milisecondsTilSignout = sdkConfig.timeoutConfig.secondsTilLogout * 1000;
};

let applicationTimeout = null;
let signoutTimeout = null;

export function clearTimer() {
  clearTimeout(applicationTimeout);
  clearTimeout(signoutTimeout);
}

export const initTimeout = (showTimeoutModal, needsResetData = false, resetData = null) => {
  settingTimer();
  clearTimer();

  // Clears any existing timeouts and starts the timeout for warning, after set time shows the modal and starts signout timer
  applicationTimeout = setTimeout(() => {
    showTimeoutModal(true);
    signoutTimeout = setTimeout(() => {
      if (needsResetData) {
        resetData();
      } else {
        triggerLogout();
      }
    }, milisecondsTilSignout);
  }, milisecondsTilWarning);
};

// Sends 'ping' to pega to keep session alive and then initiates the timeout
// export function staySignedIn(
//   setShowTimeoutModal,
//   claimsListApi,
//   refreshSignin = true,
//   needsResetData = false,
//   resetData = null
// ) {
//   if (refreshSignin && !!claimsListApi) {
//     // @ts-ignore
//     PCore.getDataPageUtils().getDataAsync(claimsListApi, 'root');
//   }
//   setShowTimeoutModal(false);
//   initTimeout(setShowTimeoutModal, needsResetData, resetData);
// }
