# Pega Auth

The **Pega Auth** repo is used to create the [**@pega/auth**](https://www.npmjs.com/package/@pega/auth) npm package.

This package contains 3 distinct libraries: oauth-client (default), auth-code-redirect and sdk-auth-manager

## oauth-client

The oauth-client library is the default library and is available by a simple import of '@pega/auth'. It implements simple OAuth client library for browser or Node cli clients to leverage OAuth services provided by Pega Infinity and Pega Launchpad. The methods facilitate the implementation of supported client-side initiated grant flows to the Pega Server. Presently it supports the following grant types: authorization code (with or without PKCE), client credentials, password credentials and custom bearer.

The library contains a single JS Class named PegaAuth, which facilitates the acquisition and management of OAuth tokens for a Web or Node client.

## auth-code-redirect

The auth-code-redirect library facilitates the transfer of a received code or error at the end of an authorization code grant flow to the oauth-client library code, so it may proceed with access_token acquisition or reacting or reporting to the error encountered.

## sdk-auth-manager

The library facilitates additional management of Authentication tokens as well as the bootstrapping of the Constellation Orchestration Engine and will be leveraged by the Pega Constellation SDKs for React and Angular and Web Components.

<hr />

## oauth-client library usage

To leverage this library, import the **PegaAuth** class from the default @pega/auth package or from '@pega/auth/oauth-client'.

Main methods:

### constructor( ssKeyConfig, ssKeyDynState='')

The PegaAuth constructor takes one required argument (ssKeyConfig) which passes in an object with various configuration properties and values or is a string value indicating a sessionStorage key from which to read a JSON stringified representation of such a config object.

The constructor also has a 2nd optional argument (ssKeyDynState) which can either pass an initial empty object which should be used to place all dynamic state runtime property values, or may be a string value indicating a sessionStorage key from which to read and update such dynamic state. If omitted, and a string value is passed as first argument, '\_DS' is appended to that value and dynamic state is saved to that session storage location.

Table of config values

| Property Name       | Type     | Default    | Description                                                                                                                                                                                     |
| ------------------- | -------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| serverType          | string   | 'infinity' | 'infinity' or 'launchpad'                                                                                                                                                                       |
| clientId            | string   |            | OAuth 2.0 client registration id                                                                                                                                                                |
| grantType           | string   | 'authCode' | OAuth 2.0 grant type (or 'none' for custom auth). Supported values: 'authCode", 'customBearer', 'clientCreds', 'passwordCreds' or 'none'                                                        |
| clientSecret        | string   |            | OAuth 2.0 client secret (only for confidential OAuth 2.0 client registrations)                                                                                                                  |
| redirectUri         | string   |            | OAuth 2.0 redirect URI (only relevant for 'authCode' grant type)                                                                                                                                |
| authorizeUri        | string   |            | URI to OAuth 2.0 authorize endpoint (only relevant for 'authCode' grant type)                                                                                                                   |
| authService         | string   |            | Infinity Authentication service alias (only relevant for 'authCode' grant type)                                                                                                                 |
| appAlias            | string   |            | Application alias for pega app being accessed. If not specified will utilize the default access group within the current user's operator record                                                 |
| userIdentifier      | string   |            | Pega operator user identifier to use (only relevant for 'authCode' grant type)                                                                                                                  |
| password            | string   |            | B64 encoded Pega operator password to use (only relevant for 'authCode' and 'passwordCreds' grant types)                                                                                        |
| noPKCE              | boolean  | false      | Set to true to disable PKCE (only relevant for 'authCode' grant type)                                                                                                                           |
| silentTimeout       | integer  | 5000       | Milliseconds to wait for response during 'silent authentication' (only relevant for 'authCode' grant type)                                                                                      |
| iframeLoginUI       | boolean  | false      | Set to _true_ to make a failed silent authentication iframe visible, rather than opening a popup window when silent authentication fails or times out (only relevant for 'authCode' grant type) |
| tokenUri            | string   |            | OAuth 2.0 token URI                                                                                                                                                                             |
| customTokenParams   | string   |            | JSON structure with params to pass as part of customBearer grant flow                                                                                                                           |
| noPopups            | boolean  | false      | Set to _true_ to disable any popup window attempts (only relevant for 'authCode' grant type)                                                                                                    |
| cert                | string   |            | Path to certificate (only relevant for node usage and for 'authCode' grant type)                                                                                                                |
| key                 | string   |            | Path to key (only relevant for node usage and for 'authCode' grant type)                                                                                                                        |
| winTitle            | string   |            | Title of window to use on a local redirect (only relevant for node usage and for 'authCode' grant type)                                                                                         |
| winBodyHtml         | string   |            | Markup to place within window for a local redirect (only relevant for node usage and for 'authCode' grant type)                                                                                 |
| isolationId         | string   |            | Deprecated (Launchpad only)                                                                                                                                                                     |
| transform           | boolean  | true       | Set to _false_ to disable obfuscation of values stored in sessionStorage                                                                                                                        |
| fnDynStateChangedCB | function |            | function to invoke when a dynamic static property has changed                                                                                                                                   |
| useNodeFetch        | boolean  | false      | Set to _true_ to force the usage of node-fetch library (only relevant for node usage)                                                                                                           |
| secureCookie        | boolean  | false      | Set to _true_ to have server generate secure Pega-AAT and Pega-ART cookies for housing the access token and refresh token.                                                                      |

Current Dynamic State properties updated during PegaAuth usage

| Property Name        | Type    | Default | Description                                                                                                                                                           |
| -------------------- | ------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| codeVerifier         | string  |         | codeVerifier value at start of auth code flow (important to save and have available particularly on a main window redirect) (only relevant for 'authCode' grant type) |
| state                | string  |         | state value generated by client at start of auth code flow and used to compare with state returned with authorization code                                            |
| sessionIndex         | string  |         | sessionIndex value returned with first token endpoint call to then be passed on subsequent full re-authentications to tie the sessions together                       |
| sessionIndexAttempts | number  |         | used prior to Infinity '24 and support for proper auth code flow error reporting                                                                                      |
| acRedirectUri        | string  |         | redirect uri used at start of auth code flow and sent later on matching token endpoint                                                                                |
| silentAuthFailed     | boolean |         | Keeps track of if silent auth failed so any retry should be a visible one (only relevant for 'authCode' grant type)                                                   |

### async login()

The login method executes the specified OAuth 2.0 grantType and returns a promise which will contain the immediate or eventual token endpoint response.

### loginRedirect()

The loginRedirect method kicks off an authorization code grant flow on the main window (only relevant for grantType='authCode').

### checkStateMatch(state)

Returns true if the passed in state value matches the state which was set at the start of an authorization code grant flow (only relevant for grantType='authCode').

### getToken(authCode)

Uses the passed in authCode to retrieve the access_token and any optional refresh_token specified for the OAuth 2.0 client registration.

### async refreshToken(refreshToken)

Uses the passed in refreshToken to generate a new access_token as well as an updated refresh_token (if a refresh_token is enabled within the OAuth 2.0 client registration).

### async revokeTokens(accessToken, refreshToken=null)

Revoke the specified tokens to in effect end the authentication session.

### async getUserinfo(accessToken)

Retrieve the "user information" object associated with the passed in accessToken.

<hr />

## License

This project is licensed under the terms of the **Apache 2** license.

The full license is available within the file named "LICENSE" and on [apache.org](https://www.apache.org/licenses/LICENSE-2.0).
