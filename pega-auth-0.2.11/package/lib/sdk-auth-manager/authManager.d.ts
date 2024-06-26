/**
 * Retrieve UserInfo for current authentication service
 */
export declare const getUserInfo: () => any;
export declare const login: (bFullReauth?: boolean) => void;
export declare const authRedirectCallback: (href: any, fnLoggedInCB?: any) => void;
/**
 * Silent or visible login based on login status
 *  @param {Object} loginProps - extensible props related to alterring login/bootstrap.  Includes
 *    appName - unique name for application route (will be used to clear an session storage for another route) (default: 'undefined')
 *    mainRedirect - permint the initial main window redirect that happens in scenarios where it is OK to transition
 *      away from the main page (default: false)
 *    deferLogin - defer login and bootstrap of Constellation (if not already authenticated)(default:true)
 *    redirectDoneCB - callback to invoke when a authCode redirect completes on the main window (used to allow app
 *      to implement a route transition rather than the default location navigation) (default: null)
 *    locale - use a specific locale override (possibly different than locale specified in operator record) (default: null)
 */
export declare const loginIfNecessary: (loginProps: any) => void;
export declare const getHomeUrl: () => string;
export declare const authIsMainRedirect: () => boolean;
export declare const sdkIsLoggedIn: () => boolean;
export declare const logout: () => Promise<unknown>;
export declare const sdkSetAuthHeader: (authHeader: any) => void;
export declare const sdkSetCustomTokenParamsCB: (fnCustomTokenParamsCB: (() => any) | null) => void;
export declare const getAvailablePortals: () => Promise<string[]>;
//# sourceMappingURL=authManager.d.ts.map