// This file wraps various calls related to logging in, logging out, etc.
//  that use the auth.html/auth.js to do the work of logging in via OAuth 2.0.
// It utilizes a JS Class and private members to protect any sensitive tokens
//  and token obfuscation routines
import { PegaAuth } from '../oauth-client/auth.js';
import { isEmptyObject } from './common-utils.js';
import { getSdkConfig, SdkConfigAccess } from './config_access.js';
// Meant to be a singleton...only one instance per page
class AuthManager {
    #ssKeyPrefix = 'rs';
    // will store the PegaAuth (OAuth 2.0 client library) instance
    #pegaAuth = null;
    #ssKeyConfigInfo = '';
    #ssKeySessionInfo = '';
    #ssKeyTokenInfo = '';
    #ssKeyState = `${this.#ssKeyPrefix}State`;
    #authConfig = {};
    #authDynState = {};
    #authHeader = null;
    #customTokenParamsCB = null;
    // state that should be persisted across loads
    state = { usePopup: false, noInitialRedirect: false, locale: null };
    bC11NBootstrapInProgress = false;
    bCustomAuth = false;
    #tokenInfo;
    #userInfo;
    onLoadDone = false;
    msReauthStart = null;
    initInProgress = false;
    isLoggedIn = false;
    // Whether to pass a session storage key or structure to auth library
    #usePASS = false;
    #beforeUnloadAdded = false;
    #tokenStorage = 'temp';
    #transform = true;
    #foldSpot = 2;
    // Whether to load and cache user info as part of login
    #loadUserinfo = false;
    constructor() {
        // Auth Manager specific state is saved within session storage as important in redirect and popup window scenarios
        this.#loadState();
    }
    #transformAndParse(ssKey, ssItem, bForce = false) {
        let obj = {};
        try {
            obj = JSON.parse(this.#transformer(ssKey, ssItem, false, bForce));
        }
        catch (e) {
            // fall thru and return empty object
        }
        return obj;
    }
    // helper routine to retrieve JSON object stored in a session storage key
    // a 2nd optional arg can also retrieve an individual attribute
    #getStorage(ssKey, sAttrib = null) {
        const ssItem = ssKey ? window.sessionStorage.getItem(ssKey) : null;
        let obj = {};
        if (ssItem) {
            try {
                obj = JSON.parse(ssItem);
            }
            catch (e) {
                obj = this.#transformAndParse(ssKey, ssItem, true);
            }
        }
        return sAttrib ? obj[sAttrib] : obj;
    }
    // helper routine to set storage to the passed in JSON
    #setStorage(ssKey, obj) {
        // Set storage only if obj is not empty, else delete the storage
        if (!obj || isEmptyObject(obj)) {
            window.sessionStorage.removeItem(ssKey);
        }
        else {
            // const bClear = (ssKey === this.#ssKeyState || ssKey === this.#ssKeySessionInfo);
            const bClear = false;
            const sValue = bClear
                ? JSON.stringify(obj)
                : this.#transformer(ssKey, JSON.stringify(obj), true);
            window.sessionStorage.setItem(ssKey, sValue);
        }
    }
    #calcFoldSpot(s) {
        const nOffset = 1;
        const sChar = s.length > nOffset ? s.charAt(nOffset) : '2';
        const nSpot = parseInt(sChar, 10);
        this.#foldSpot = Number.isNaN(nSpot) ? 2 : (nSpot % 4) + 2;
    }
    // helper function to encode storage
    #transformer(ssKey, s, bIn, bForce = false) {
        const bTransform = bForce || this.#transform;
        const fnFold = (x) => {
            const nLen = x.length;
            const nExtra = nLen % this.#foldSpot;
            const nOffset = Math.floor(nLen / this.#foldSpot) + nExtra;
            const nRem = x.length - nOffset;
            return x.substring(bIn ? nOffset : nRem) + x.substring(0, bIn ? nOffset : nRem);
        };
        const bTknInfo = ssKey === this.#ssKeyTokenInfo;
        if (bTknInfo && !bIn && bTransform) {
            s = window.atob(fnFold(s));
        }
        // eslint-disable-next-line no-nested-ternary
        let result = bTransform ? (bIn ? window.btoa(s) : window.atob(s)) : s;
        if (bTknInfo && bIn && bTransform) {
            result = fnFold(window.btoa(result));
        }
        return result;
    }
    // Setter for authHeader (no getter)
    set authHeader(value) {
        this.#authHeader = value;
        // setAuthorizationHeader method not available til 8.8 so do safety check
        if (window.PCore?.getAuthUtils().setAuthorizationHeader) {
            const authHdr = value === null ? '' : value;
            window.PCore.getAuthUtils().setAuthorizationHeader(authHdr);
        }
        this.#updateLoginStatus();
    }
    // Setter for customTokenParamsCB
    set customTokenParamsCB(fn) {
        this.#customTokenParamsCB = fn;
    }
    // Setter/getter for usePopupForRestOfSession
    set usePopupForRestOfSession(usePopup) {
        this.state.usePopup = usePopup;
        this.#setStorage(this.#ssKeyState, this.state);
    }
    get usePopupForRestOfSession() {
        return this.state.usePopup;
    }
    // Setter/getter for noInitialRedirect
    set noInitialRedirect(bNoInitialRedirect) {
        if (bNoInitialRedirect) {
            this.usePopupForRestOfSession = true;
        }
        this.state.noInitialRedirect = bNoInitialRedirect;
        this.#setStorage(this.#ssKeyState, this.state);
    }
    get noInitialRedirect() {
        return this.state.noInitialRedirect || false;
    }
    // Setter/getter for locale (override)
    set locale(localeOverride) {
        this.state.locale = localeOverride;
        this.#setStorage(this.#ssKeyState, this.state);
    }
    get locale() {
        return this.state.locale;
    }
    // Init/getter for reauthStart
    set reauthStart(msValue) {
        if (msValue) {
            this.msReauthStart = msValue;
        }
        else if (this.msReauthStart) {
            delete this.msReauthStart;
        }
        this.#setStorage(this.#ssKeyState, this.state);
    }
    get reauthStart() {
        return this.msReauthStart || 0;
    }
    // Setter for clientId
    set keySuffix(s) {
        this.state.sfx = s || undefined;
        this.#setStorage(this.#ssKeyState, this.state);
        if (s) {
            // To make it a bit more obtuse reverse the string and use that as the actual suffix
            const sSfx = s.split('').reverse().join('');
            this.#ssKeyConfigInfo = `${this.#ssKeyPrefix}CI_${sSfx}`;
            this.#ssKeySessionInfo = `${this.#ssKeyPrefix}SI_${sSfx}`;
            this.#ssKeyTokenInfo = `${this.#ssKeyPrefix}TI_${sSfx}`;
            this.#calcFoldSpot(sSfx);
        }
    }
    /**
     * Clean up any session storage allocated for the user session.
     */
    clear(bFullReauth = false) {
        if (!this.bCustomAuth) {
            this.#authHeader = null;
        }
        if (!bFullReauth) {
            if (this.#usePASS) {
                sessionStorage.removeItem(this.#ssKeyConfigInfo);
            }
            else {
                this.#authConfig = {};
                this.#authDynState = {};
            }
            sessionStorage.removeItem(this.#ssKeySessionInfo);
        }
        // Clear any established auth tokens
        this.#tokenInfo = null;
        sessionStorage.removeItem(this.#ssKeyTokenInfo);
        this.isLoggedIn = false;
        // reset the initial redirect as well by using this setter
        this.usePopupForRestOfSession = bFullReauth;
        this.keySuffix = '';
    }
    // Found beforeunload to not work well on iOS browsers, and pagehide to work better
    // However also seeing some scenario like navigating to a different page on Chrome & Firefox only invoking beforeunload
    // Chrome, Firefox, Safari browsers sequence on page reload: beforeunload, pagehide, visibilitychange
    // visibilitychange is fired whenever a tab is made visible and when it is hidden
    #doUnloadUpdates() {
        // Safari and particularly Safari on mobile devices doesn't seem to load this on first main redirect or
        // reliably, so have moved to having PegaAuth manage writing all state props to session storage
        this.#setStorage(this.#ssKeyState, this.state);
        this.#setStorage(this.#ssKeySessionInfo, this.#authDynState);
        // If tokenStorage was always, token would already be there
        if (this.#tokenStorage === 'temp') {
            this.#setStorage(this.#ssKeyTokenInfo, this.#tokenInfo);
        }
    }
    #doBeforeUnload() {
        this.#doUnloadUpdates();
    }
    #doPageHide() {
        this.#doUnloadUpdates();
    }
    #loadState() {
        // Note: State storage key doesn't have a client id associated with it
        const oState = this.#getStorage(this.#ssKeyState);
        if (oState) {
            Object.assign(this.state, oState);
            if (this.state.sfx) {
                // Setter sets up the ssKey values as well
                this.keySuffix = this.state.sfx;
            }
        }
    }
    // This is only called from initialize after #ssKey values are setup
    #doOnLoad() {
        if (!this.onLoadDone) {
            // This authConfig state doesn't collide with other calculated static state...so load it first
            // Note: transform setting will have already been loaded into #authConfig at this point
            this.#authDynState = this.#getStorage(this.#ssKeySessionInfo);
            this.#tokenInfo = this.#getStorage(this.#ssKeyTokenInfo);
            if (this.#tokenStorage !== 'always') {
                sessionStorage.removeItem(this.#ssKeyTokenInfo);
                sessionStorage.removeItem(this.#ssKeySessionInfo);
            }
            this.onLoadDone = true;
        }
    }
    // Callback when auth dynamic state has changed. Decide whether to persisting it based on
    //  config settings
    #doAuthDynStateChanged() {
        // If tokenStorage is setup for always then always persist the auth dynamic state as well
        if (this.#tokenStorage === 'always') {
            this.#setStorage(this.#ssKeySessionInfo, this.#authDynState);
        }
    }
    /**
     * Initialize OAuth config structure members and create authMgr instance (if necessary)
     * bNew - governs whether to create new sessionStorage or load existing one
     */
    async #initialize(bNew = false) {
        return new Promise(resolve => {
            if (!this.initInProgress && (bNew || isEmptyObject(this.#authConfig) || !this.#pegaAuth)) {
                this.initInProgress = true;
                getSdkConfig().then(sdkConfig => {
                    const sdkConfigAuth = sdkConfig.authConfig;
                    const sdkConfigServer = sdkConfig.serverConfig;
                    const serverType = sdkConfigServer.serverType || 'infinity';
                    const bInfinity = serverType === 'infinity';
                    let pegaUrl = bInfinity
                        ? sdkConfigServer.infinityRestServerUrl
                        : sdkConfigServer.launchpadRestServerUrl;
                    // Expecting boolean true/false or undefined
                    const secureCookie = !!sdkConfigAuth.secureCookie;
                    const bNoInitialRedirect = this.noInitialRedirect;
                    const appAliasSeg = sdkConfigServer.appAlias ? `app/${sdkConfigServer.appAlias}/` : '';
                    // Construct default OAuth endpoints (if not explicitly specified)
                    if (pegaUrl) {
                        // Cope with trailing slash being present
                        if (!pegaUrl.endsWith('/')) {
                            pegaUrl += '/';
                        }
                        if (!sdkConfigAuth.authorize) {
                            sdkConfigAuth.authorize = bInfinity
                                ? `${pegaUrl}PRRestService/oauth2/v1/authorize`
                                : `${pegaUrl}uas/oauth/authorize`;
                        }
                        const infinityOAuth2Url = bInfinity
                            ? pegaUrl + (secureCookie && appAliasSeg ? `${appAliasSeg}/api/` : 'PRRestService/')
                            : '';
                        if (!sdkConfigAuth.token) {
                            sdkConfigAuth.token = bInfinity
                                ? `${infinityOAuth2Url}oauth2/v1/token`
                                : `${pegaUrl}uas/oauth/token`;
                        }
                        if (!sdkConfigAuth.revoke) {
                            sdkConfigAuth.revoke = bInfinity ? `${infinityOAuth2Url}oauth2/v1/revoke` : '';
                        }
                        if (!sdkConfigAuth.redirectUri) {
                            sdkConfigAuth.redirectUri = `${window.location.origin}${window.location.pathname}`;
                        }
                        if (!sdkConfigAuth.userinfo) {
                            sdkConfigAuth.userinfo = bInfinity
                                ? `${pegaUrl}${appAliasSeg}api/oauthclients/v1/userinfo/JSON`
                                : '';
                        }
                    }
                    // Auth service alias
                    if (!sdkConfigAuth.authService) {
                        sdkConfigAuth.authService = 'pega';
                    }
                    // mashupAuthService provides way to have a different auth service for embedded
                    if (!sdkConfigAuth.mashupAuthService) {
                        sdkConfigAuth.mashupAuthService = sdkConfigAuth.authService;
                    }
                    // Construct path to auth.html (used for case when not doing a main window redirect)
                    let sNoMainRedirectUri = sdkConfigAuth.redirectUri;
                    const nLastPathSep = sNoMainRedirectUri.lastIndexOf('/');
                    sNoMainRedirectUri =
                        nLastPathSep !== -1
                            ? `${sNoMainRedirectUri.substring(0, nLastPathSep + 1)}auth.html`
                            : `${sNoMainRedirectUri}/auth.html`;
                    const portalGrantType = sdkConfigAuth.portalGrantType || 'authCode';
                    const mashupGrantType = sdkConfigAuth.mashupGrantType || 'authCode';
                    // Some grant types are only available with confidential registrations and require a client secret
                    const clientSecret = bNoInitialRedirect
                        ? sdkConfigAuth.mashupClientSecret
                        : sdkConfigAuth.portalClientSecret;
                    const pegaAuthConfig = {
                        serverType,
                        clientId: bNoInitialRedirect
                            ? sdkConfigAuth.mashupClientId
                            : sdkConfigAuth.portalClientId,
                        grantType: bNoInitialRedirect ? mashupGrantType : portalGrantType,
                        tokenUri: sdkConfigAuth.token,
                        revokeUri: sdkConfigAuth.revoke,
                        userinfoUri: sdkConfigAuth.userinfo,
                        authService: bNoInitialRedirect
                            ? sdkConfigAuth.mashupAuthService
                            : sdkConfigAuth.authService,
                        appAlias: sdkConfigServer.appAlias || '',
                        useLocking: true
                    };
                    if (clientSecret) {
                        pegaAuthConfig.clientSecret = clientSecret;
                    }
                    if (serverType === 'launchpad' && pegaAuthConfig.grantType === 'authCode') {
                        pegaAuthConfig.noPKCE = true;
                    }
                    // Invoke keySuffix setter
                    // Was using pegaAuthConfig.clientId as key but more secure to just use a random string as getting
                    //  both a clientId and the refresh token could yield a new access token.
                    // Suffix is so we might in future move to an array of suffixes based on the appName, so might store
                    //  both portal and embedded tokens/session info at same time
                    if (!this.state?.sfx) {
                        // Just using a random number to make the suffix unique on each session
                        this.keySuffix = `${Math.ceil(Math.random() * 100000000)}`;
                    }
                    this.#authConfig.transform =
                        sdkConfigAuth.transform !== undefined ? sdkConfigAuth.transform : this.#transform;
                    // Using property in class as authConfig may be empty at times
                    this.#transform = this.#authConfig.transform;
                    if (sdkConfigAuth.tokenStorage !== undefined) {
                        this.#tokenStorage = sdkConfigAuth.tokenStorage;
                    }
                    if (sdkConfigAuth.secureCookie) {
                        this.#authConfig.secureCookie = true;
                    }
                    // Get latest state once client ids, transform and tokenStorage have been established
                    this.#doOnLoad();
                    // If no clientId is specified assume not OAuth but custom auth
                    if (!pegaAuthConfig.clientId) {
                        this.bCustomAuth = true;
                        return;
                    }
                    if (pegaAuthConfig.grantType === 'authCode') {
                        const authCodeProps = {
                            authorizeUri: sdkConfigAuth.authorize,
                            // If we have already specified a redirect on the authorize redirect, we need to continue to use that
                            //  on token endpoint
                            redirectUri: bNoInitialRedirect || this.usePopupForRestOfSession
                                ? sNoMainRedirectUri
                                : sdkConfigAuth.redirectUri
                        };
                        if ('silentTimeout' in sdkConfigAuth) {
                            authCodeProps.silentTimeout = sdkConfigAuth.silentTimeout;
                        }
                        if (bNoInitialRedirect &&
                            pegaAuthConfig.authService === 'pega' &&
                            sdkConfigAuth.mashupUserIdentifier &&
                            sdkConfigAuth.mashupPassword) {
                            authCodeProps.userIdentifier = sdkConfigAuth.mashupUserIdentifier;
                            authCodeProps.password = sdkConfigAuth.mashupPassword;
                        }
                        if ('iframeLoginUI' in sdkConfigAuth) {
                            authCodeProps.iframeLoginUI =
                                sdkConfigAuth.iframeLoginUI.toString().toLowerCase() === 'true';
                        }
                        Object.assign(pegaAuthConfig, authCodeProps);
                    }
                    else if (pegaAuthConfig.grantType === 'passwordCreds') {
                        pegaAuthConfig.userIdentifier = sdkConfigAuth.mashupUserIdentifier;
                        pegaAuthConfig.password = sdkConfigAuth.mashupPassword;
                    }
                    Object.assign(this.#authConfig, pegaAuthConfig);
                    // Add beforeunload and page hide handlers to write out key properties that we want to survive a
                    //  browser reload
                    if (!this.#beforeUnloadAdded && (!this.#usePASS || this.#tokenStorage !== 'always')) {
                        window.addEventListener('beforeunload', this.#doBeforeUnload.bind(this));
                        window.addEventListener('pagehide', this.#doPageHide.bind(this));
                        this.#beforeUnloadAdded = true;
                    }
                    // Initialize PegaAuth OAuth 2.0 client library
                    if (this.#usePASS) {
                        this.#setStorage(this.#ssKeyConfigInfo, this.#authConfig);
                        this.#setStorage(this.#ssKeySessionInfo, this.#authDynState);
                        this.#pegaAuth = new PegaAuth(this.#ssKeyConfigInfo, this.#ssKeySessionInfo);
                    }
                    else {
                        this.#authConfig.fnDynStateChangedCB = this.#doAuthDynStateChanged.bind(this);
                        this.#pegaAuth = new PegaAuth(this.#authConfig, this.#authDynState);
                    }
                    this.initInProgress = false;
                    resolve(this.#pegaAuth);
                });
            }
            else {
                let idNextCheck;
                const fnCheckForAuthMgr = () => {
                    if (!this.initInProgress) {
                        if (idNextCheck) {
                            clearInterval(idNextCheck);
                        }
                        resolve(this.#pegaAuth);
                    }
                };
                fnCheckForAuthMgr();
                idNextCheck = setInterval(fnCheckForAuthMgr, 100);
            }
        });
    }
    /**
     * Initiate the process to get the Constellation bootstrap shell loaded and initialized
     * @param {Object} tokenInfo
     * @param {Function} authTokenUpdated - callback invoked when Constellation JS Engine silently updates
     *      an expired access_token
     * @param {Function} fnReauth - callback invoked when a full or custom reauth is needed
     */
    #constellationInit(tokenInfo, authTokenUpdated, fnReauth) {
        const constellationBootConfig = {};
        const sdkConfigServer = SdkConfigAccess.getSdkConfigServer();
        const authConfig = this.#authConfig;
        // Set up constellationConfig with data that bootstrapWithAuthHeader expects
        constellationBootConfig.customRendering = true;
        constellationBootConfig.restServerUrl = sdkConfigServer.infinityRestServerUrl;
        // NOTE: Needs a trailing slash! So add one if not provided
        if (!sdkConfigServer.sdkContentServerUrl.endsWith('/')) {
            sdkConfigServer.sdkContentServerUrl = `${sdkConfigServer.sdkContentServerUrl}/`;
        }
        constellationBootConfig.staticContentServerUrl = `${sdkConfigServer.sdkContentServerUrl}constellation/`;
        if (!constellationBootConfig.staticContentServerUrl.endsWith('/')) {
            constellationBootConfig.staticContentServerUrl = `${constellationBootConfig.staticContentServerUrl}/`;
        }
        // If appAlias specified, use it
        if (sdkConfigServer.appAlias) {
            constellationBootConfig.appAlias = sdkConfigServer.appAlias;
        }
        if (this.#authConfig.grantType === 'customBearer' || !tokenInfo) {
            if (tokenInfo) {
                this.#authHeader = `${tokenInfo.token_type} ${tokenInfo.access_token}`;
            }
            constellationBootConfig.authorizationHeader = this.#authHeader;
        }
        else {
            // Pass in auth info to Constellation
            constellationBootConfig.authInfo = {
                authType: 'OAuth2.0',
                tokenInfo,
                // Set whether we want constellation to try to do a full re-Auth or not ()
                // true doesn't seem to be working in SDK scenario so always passing false for now
                popupReauth: false /* !this.noInitialRedirect */,
                client_id: authConfig.clientId,
                authentication_service: authConfig.authService,
                redirect_uri: authConfig.redirectUri,
                endPoints: {
                    authorize: authConfig.authorizeUri,
                    token: authConfig.tokenUri,
                    revoke: authConfig.revokeUri
                },
                secureCookie: authConfig.secureCookie,
                onTokenRetrieval: authTokenUpdated
            };
        }
        // Turn off dynamic load components (should be able to do it here instead of after load?)
        constellationBootConfig.dynamicLoadComponents = false;
        // Set envType if appropriate
        if (authConfig.serverType === 'launchpad') {
            constellationBootConfig.envType = 'LAUNCHPAD';
        }
        // Set locale override if specified
        const localeOverride = this.locale;
        if (localeOverride) {
            constellationBootConfig.locale = localeOverride;
        }
        if (this.bC11NBootstrapInProgress) {
            return;
        }
        this.bC11NBootstrapInProgress = true;
        // Note that staticContentServerUrl already ends with a slash (see above), so no slash added.
        // In order to have this import succeed needed to use the webpackIgnore magic comment tag.
        // See:  https://webpack.js.org/api/module-methods/
        import(
        /* webpackIgnore: true */ `${constellationBootConfig.staticContentServerUrl}bootstrap-shell.js`).then(bootstrapShell => {
            // NOTE: once this callback is done, we lose the ability to access loadMashup.
            //  So, create a reference to it
            window.myLoadMashup = bootstrapShell.loadMashup;
            window.myLoadPortal = bootstrapShell.loadPortal;
            window.myLoadDefaultPortal = bootstrapShell.loadDefaultPortal;
            bootstrapShell
                .bootstrapWithAuthHeader(constellationBootConfig, 'pega-root')
                .then(() => {
                // eslint-disable-next-line no-console
                console.log('ConstellationJS bootstrap successful!');
                this.bC11NBootstrapInProgress = false;
                // Setup listener for the reauth event
                if (tokenInfo) {
                    PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_FULL_REAUTH, fnReauth, 'authFullReauth');
                }
                else {
                    // customReauth event introduced with 8.8
                    const sEvent = PCore.getConstants().PUB_SUB_EVENTS.EVENT_CUSTOM_REAUTH;
                    if (sEvent) {
                        PCore.getPubSubUtils().subscribe(sEvent, fnReauth, 'doReauth');
                    }
                }
                // Fire SdkConstellationReady event so bridge and app route can do expected post PCore initializations
                const event = new CustomEvent('SdkConstellationReady', {});
                document.dispatchEvent(event);
            })
                .catch(e => {
                // Assume error caught is because token is not valid and attempt a full reauth
                // eslint-disable-next-line no-console
                console.error(`ConstellationJS bootstrap failed. ${e}`);
                this.bC11NBootstrapInProgress = false;
                fnReauth();
            });
        });
        /* Ends here */
    }
    #customConstellationInit(fnReauth) {
        this.#constellationInit(null, null, fnReauth);
    }
    #fireTokenAvailable(token, bLoadC11N = true) {
        if (!token) {
            // This is used on page reload to load the token from sessionStorage and carry on
            token = this.#tokenInfo;
            if (!token) {
                return;
            }
        }
        this.#tokenInfo = token;
        if (this.#tokenStorage === 'always') {
            this.#setStorage(this.#ssKeyTokenInfo, this.#tokenInfo);
        }
        this.#updateLoginStatus();
        // this.isLoggedIn is getting updated in updateLoginStatus
        this.isLoggedIn = true;
        this.usePopupForRestOfSession = true;
        if (!window.PCore && bLoadC11N) {
            this.#constellationInit(token, this.#authTokenUpdated.bind(this), this.#authFullReauth.bind(this));
        }
        /*
        // Create and dispatch the SdkLoggedIn event to trigger constellationInit
        const event = new CustomEvent('SdkLoggedIn', { detail: { authConfig, tokenInfo: token } });
        document.dispatchEvent(event);
        */
    }
    #processTokenOnLogin(token, bLoadC11N = true) {
        this.#tokenInfo = token;
        if (this.#tokenStorage === 'always') {
            this.#setStorage(this.#ssKeyTokenInfo, this.#tokenInfo);
        }
        if (this.#authConfig.grantType === 'customBearer') {
            // authHeader setter will also set #authHeader and invoke getAuthUtils().setAuthorizationHeader
            this.authHeader = `${token.token_type} ${token.access_token}`;
        }
        if (window.PCore && !this.#authHeader) {
            PCore.getAuthUtils().setTokens(token);
        }
        else {
            this.#fireTokenAvailable(token, bLoadC11N);
        }
    }
    #doCustomTokenParamsCB() {
        if (this.#authConfig.grantType === 'customBearer' && this.#customTokenParamsCB) {
            try {
                const customTokenParams = this.#customTokenParamsCB();
                if (customTokenParams) {
                    this.#authConfig.customTokenParams = customTokenParams;
                }
            }
            catch (e) {
                // eslint-disable-next-line no-console
                console.error(`Error on customTokenParams callback. ${e}`);
            }
        }
    }
    updateRedirectUri(sRedirectUri) {
        this.#authConfig.redirectUri = sRedirectUri;
    }
    /**
     * Get available portals which supports SDK
     * @returns list of available portals (portals other than excludingPortals list)
     */
    async getAvailablePortals() {
        return new Promise(resolve => {
            getSdkConfig().then(sdkConfig => {
                const serverConfig = sdkConfig.serverConfig;
                const userAccessGroup = PCore.getEnvironmentInfo().getAccessGroup();
                const dataPageName = 'D_OperatorAccessGroups';
                const serverUrl = serverConfig.infinityRestServerUrl;
                const appAlias = serverConfig.appAlias;
                const appAliasPath = appAlias ? `/app/${appAlias}` : '';
                const arExcludedPortals = serverConfig.excludePortals;
                const headers = {
                    Authorization: this.#authHeader === null ? '' : this.#authHeader,
                    'Content-Type': 'application/json'
                };
                // Using v1 API here as v2 data_views is not able to access same data page currently.  Should move to avoid having this logic to find
                //  a default portal or constellation portal and rather have Constellation JS Engine API just load the default portal
                return fetch(`${serverUrl}${appAliasPath}/api/v1/data/${dataPageName}`, {
                    method: 'GET',
                    headers
                })
                    .then(response => {
                    if (response.ok && response.status === 200) {
                        return response.json();
                    }
                    if (response.status === 401) {
                        // Might be either a real token expiration or revoke, but more likely that the "api" service package is misconfigured
                        throw new Error(`Attempt to access ${dataPageName} failed.  The "api" service package is likely not configured to use "OAuth 2.0"`);
                    }
                    throw new Error(`HTTP Error: ${response.status}`);
                })
                    .then(async (agData) => {
                    const arAccessGroups = agData.pxResults;
                    const availablePortals = [];
                    for (const ag of arAccessGroups) {
                        if (ag.pyAccessGroup === userAccessGroup) {
                            // eslint-disable-next-line no-console
                            console.error(`Default portal for current operator (${ag.pyPortal}) is not compatible with SDK.\nConsider using a different operator, adjusting the default portal for this operator, or using "appPortal" setting within sdk-config.json to specify a specific portal to load.`);
                            let portal = null;
                            for (portal of ag.pyUserPortals) {
                                if (!arExcludedPortals.includes(portal.pyPortalLayout)) {
                                    availablePortals.push(portal.pyPortalLayout);
                                }
                            }
                            break;
                        }
                    }
                    // Found operator's current access group. Use its portal
                    // eslint-disable-next-line no-console
                    console.log(`Available portals: ${availablePortals}`);
                    resolve(availablePortals);
                })
                    .catch(e => {
                    // eslint-disable-next-line no-console
                    console.error(e.message);
                    // check specific error if 401, and wiped out if so stored token is stale.  Fetch new tokens.
                });
            });
        });
    }
    #updateLoginStatus() {
        if (!this.#authHeader && this.#tokenInfo?.access_token) {
            // Use setter to set this securely
            this.authHeader = `${this.#tokenInfo.token_type} ${this.#tokenInfo.access_token}`;
        }
        this.isLoggedIn =
            !!(this.#authHeader && this.#authHeader.length > 0) ||
                (this.#authConfig.secureCookie && Object.keys(this.#tokenInfo || {}).length > 0);
    }
    // Initiate a full OAuth re-authorization (any refresh token has also expired).
    #authFullReauth() {
        const bHandleHere = true; // Other alternative is to raise an event and have someone else handle it
        if (this.reauthStart) {
            const reauthIgnoreInterval = 300000; // 5 minutes
            const currTime = Date.now();
            const bReauthInProgress = currTime - this.reauthStart <= reauthIgnoreInterval;
            if (bReauthInProgress) {
                return;
            }
        }
        if (bHandleHere) {
            // Don't want to do a full clear of authMgr as will loose state props (like sessionIndex).  Rather just clear the tokens
            this.clear(true);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            login(true);
        }
        else {
            // Fire the SdkFullReauth event to indicate a new token is needed (PCore.getAuthUtils.setTokens method
            //  should be used to communicate the new token to Constellation JS Engine.
            const event = new CustomEvent('SdkFullReauth', {
                detail: this.#processTokenOnLogin.bind(this)
            });
            document.dispatchEvent(event);
        }
    }
    // Passive update where just session storage is updated so can be used on a window refresh
    #authTokenUpdated(tokenInfo) {
        this.#tokenInfo = tokenInfo;
    }
    // TODO: Cope with 401 and refresh token if possible (or just hope that it succeeds during login)
    /**
     * Retrieve UserInfo for current authentication service
     */
    getUserInfo() {
        if (this.#userInfo) {
            return this.#userInfo;
        }
        return this.#initialize(false).then(aMgr => {
            return aMgr.getUserinfo(this.#tokenInfo.access_token).then(data => {
                this.#userInfo = data;
                return this.#userInfo;
            });
        });
    }
    login(bFullReauth = false) {
        if (this.bCustomAuth)
            return;
        this.#initialize(!bFullReauth).then(aMgr => {
            const sdkConfigAuth = SdkConfigAccess.getSdkConfigAuth();
            if (this.#authConfig.grantType === 'authCode') {
                const bMainRedirect = !this.noInitialRedirect;
                let sRedirectUri = sdkConfigAuth.redirectUri;
                // If initial main redirect is OK, redirect to main page, otherwise will authorize in a popup window
                if (bMainRedirect && !bFullReauth) {
                    // update redirect uri to be the root
                    this.updateRedirectUri(sRedirectUri);
                    aMgr.loginRedirect();
                    // Don't have token til after the redirect
                    return Promise.resolve(undefined);
                }
                // Construct path to redirect uri
                const nLastPathSep = sRedirectUri.lastIndexOf('/');
                sRedirectUri =
                    nLastPathSep !== -1
                        ? `${sRedirectUri.substring(0, nLastPathSep + 1)}auth.html`
                        : `${sRedirectUri}/auth.html`;
                // Set redirectUri to static auth.html
                this.updateRedirectUri(sRedirectUri);
            }
            return new Promise((resolve, reject) => {
                this.#doCustomTokenParamsCB();
                aMgr
                    .login()
                    .then(token => {
                    this.#processTokenOnLogin(token);
                    if (this.#loadUserinfo) {
                        this.getUserInfo();
                    }
                    resolve(token.access_token);
                })
                    .catch(e => {
                    // eslint-disable-next-line no-console
                    console.log(e);
                    reject(e);
                });
            });
        });
    }
    authRedirectCallback(href, fnLoggedInCB = null) {
        // Get code from href and swap for token
        const aHrefParts = href.split('?');
        const urlParams = new URLSearchParams(aHrefParts.length > 1 ? `?${aHrefParts[1]}` : '');
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        // If state should also match before accepting code
        if (code) {
            this.#initialize(false).then(aMgr => {
                if (aMgr.checkStateMatch(state)) {
                    aMgr.getToken(code).then(token => {
                        if (token && token.token_type) {
                            this.#processTokenOnLogin(token, false);
                            if (this.#loadUserinfo) {
                                this.getUserInfo();
                            }
                            if (fnLoggedInCB) {
                                fnLoggedInCB(token.access_token);
                            }
                        }
                    });
                }
            });
        }
        else {
            const error = urlParams.get('error');
            const errorDesc = urlParams.get('errorDesc');
            fnLoggedInCB(null, error, errorDesc);
        }
    }
    loginIfNecessary(loginProps) {
        const { appName, deferLogin, redirectDoneCB, locale } = loginProps;
        const noMainRedirect = !loginProps.mainRedirect;
        // We need to load state before making any decisions
        this.#loadState();
        // If no initial redirect status of page changed...clear AuthMgr
        const currNoMainRedirect = this.noInitialRedirect;
        if (appName !== this.state.appName || noMainRedirect !== currNoMainRedirect) {
            this.clear(false);
            this.state.appName = appName;
            this.#setStorage(this.#ssKeyState, this.state);
        }
        this.noInitialRedirect = noMainRedirect;
        // Keep current state unless a locale is explicitly specified
        if (locale !== undefined) {
            this.locale = locale;
        }
        // If custom auth no need to do any OAuth logic
        if (this.bCustomAuth) {
            this.#updateLoginStatus();
            if (!window.PCore) {
                this.#customConstellationInit(() => {
                    // Fire the SdkCustomReauth event to indicate a new authHeader is needed. Event listener should invoke sdkSetAuthHeader
                    //  to communicate the new token to sdk (and Constellation JS Engine)
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    const event = new CustomEvent('SdkCustomReauth', { detail: sdkSetAuthHeader });
                    document.dispatchEvent(event);
                });
            }
            return;
        }
        if (window.location.href.includes('?code')) {
            // initialize authMgr (now initialize in constructor?)
            return this.#initialize(false).then(() => {
                const cbDefault = () => {
                    window.location.href = window.location.pathname;
                };
                // eslint-disable-next-line no-console
                console.log('About to invoke PegaAuth authRedirectCallback');
                this.authRedirectCallback(window.location.href, redirectDoneCB || cbDefault);
            });
        }
        if (!deferLogin) {
            return this.#initialize(false).then(() => {
                this.#updateLoginStatus();
                if (this.isLoggedIn) {
                    this.#fireTokenAvailable(this.#tokenInfo);
                    if (this.#loadUserinfo) {
                        this.getUserInfo();
                    }
                }
                else {
                    return this.login();
                }
            });
        }
    }
    logout() {
        if (this.#beforeUnloadAdded) {
            window.removeEventListener('beforeunload', this.#doBeforeUnload.bind(this));
            window.removeEventListener('pagehide', this.#doPageHide.bind(this));
            this.#beforeUnloadAdded = false;
        }
        return new Promise(resolve => {
            const fnClearAndResolve = () => {
                this.clear();
                const event = new Event('SdkLoggedOut');
                document.dispatchEvent(event);
                resolve(null);
            };
            if (this.bCustomAuth) {
                fnClearAndResolve();
                return;
            }
            // For secure cookie there will not be an access_token so just check for token_type
            if (this.#tokenInfo && this.#tokenInfo.token_type) {
                if (window.PCore) {
                    window.PCore.getAuthUtils()
                        .revokeTokens()
                        .catch(err => {
                        // eslint-disable-next-line no-console
                        console.log('Error:', err?.message);
                    })
                        .finally(() => {
                        fnClearAndResolve();
                    });
                }
                else {
                    this.#initialize(false).then(aMgr => {
                        aMgr
                            .revokeTokens(this.#authConfig.secureCookie ? 'cookie' : this.#tokenInfo.access_token, this.#authConfig.secureCookie && this.#tokenInfo.is_refresh_token_enabled
                            ? 'cookie'
                            : this.#tokenInfo.refresh_token)
                            .then(() => {
                            // Go to finally
                        })
                            .finally(() => {
                            fnClearAndResolve();
                        });
                    });
                }
            }
            else {
                fnClearAndResolve();
            }
        });
    }
}
const gAuthMgr = new AuthManager();
// TODO: Cope with 401 and refresh token if possible (or just hope that it succeeds during login)
/**
 * Retrieve UserInfo for current authentication service
 */
export const getUserInfo = () => {
    return gAuthMgr.getUserInfo();
};
export const login = (bFullReauth = false) => {
    return gAuthMgr.login(bFullReauth);
};
export const authRedirectCallback = (href, fnLoggedInCB = null) => {
    gAuthMgr.authRedirectCallback(href, fnLoggedInCB);
};
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
export const loginIfNecessary = (loginProps) => {
    gAuthMgr.loginIfNecessary(loginProps);
};
export const getHomeUrl = () => {
    return `${window.location.origin}/`;
};
export const authIsMainRedirect = () => {
    // Even with main redirect, we want to use it only for the first login (so it doesn't wipe out any state or the reload)
    return !gAuthMgr.noInitialRedirect && !gAuthMgr.usePopupForRestOfSession;
};
export const sdkIsLoggedIn = () => {
    return gAuthMgr.isLoggedIn;
};
export const logout = () => {
    return gAuthMgr.logout();
};
// Set the custom authorization header for the SDK (and Constellation JS Engine) to
// utilize for every DX API request
export const sdkSetAuthHeader = authHeader => {
    gAuthMgr.bCustomAuth = !!authHeader;
    // Use setter to set this securely
    gAuthMgr.authHeader = authHeader;
};
// Set specific call back function to retrieve custom token endpoint params prior to login.  This would
//  be set with specifying deferLoad='true' and prior to the invocation of the load method
export const sdkSetCustomTokenParamsCB = (fnCustomTokenParamsCB) => {
    if (typeof fnCustomTokenParamsCB === 'function') {
        gAuthMgr.customTokenParamsCB = fnCustomTokenParamsCB;
    }
};
export const getAvailablePortals = async () => {
    return gAuthMgr.getAvailablePortals();
};
//# sourceMappingURL=authManager.js.map