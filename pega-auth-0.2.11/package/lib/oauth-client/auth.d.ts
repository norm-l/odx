export class PegaAuth {
    constructor(ssKeyConfig: any, ssKeyDynState?: string);
    ssKeyConfig: string | undefined;
    ssKeyDynState: string | undefined;
    urlencoded: string;
    tokenError: string;
    isNode: boolean;
    crypto: Crypto | undefined;
    subtle: SubtleCrypto | undefined;
    login(): Promise<any>;
    loginRedirect(): void;
    checkStateMatch(state: any): boolean;
    getToken(authCode: any): Promise<any>;
    refreshToken(refreshToken: any): Promise<any>;
    /**
     * Revokes tokens (useful as part of a logout operation).  For non-secureCookie, the accessToken and
     *  the optional refreshToken would be passed in and the routine will generate two separate revoke
     *  transactions.  For secureCookie scenario, will issue just one for the accessToken, but this will
     *  also revoke the refresh token if present.
     * @param {string} accessToken - the access token (or any string value for secureCookie scenario)
     * @param {string} refreshToken - optional refresh token (or any string value for non secureCookie
     *   scenario, when a refreshToken exists)
     * @returns
     */
    revokeTokens(accessToken: string, refreshToken?: string): Promise<void>;
    getUserinfo(accessToken: any): Promise<any>;
    #private;
}
export default PegaAuth;
//# sourceMappingURL=auth.d.ts.map