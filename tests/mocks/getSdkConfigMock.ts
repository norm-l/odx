import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';

export const mockGetSdkConfig = () => {
  const mockedGetSdkConfig = getSdkConfig as jest.MockedFunction<typeof getSdkConfig>;
  return mockedGetSdkConfig;
};

// Mock with default basepath
export const mockGetSdkConfigWithBasepath = () => {
  const mockedGetSdkConfig = mockGetSdkConfig();
  mockedGetSdkConfig.mockResolvedValue({
    serverConfig: {
      sdkContentServerUrl: 'https://localhost:3502/' // Todo: Can be moved to env specific config.
    }
  });
  return mockedGetSdkConfig;
};

// Mock mobile app URL
export const mockGetSdkConfigMobileAppUrl = () => {
  const mockedGetSdkConfig = mockGetSdkConfig();
  mockedGetSdkConfig.mockResolvedValue({
    mobileApp: {
      mobileAppUrl: '/mobile-app' // Todo: Can be moved to env specific config.
    }
  });
  return mockedGetSdkConfig;
};

// Mock mobile app URL
export const mockGetSdkConfigMobileAppUA = () => {
  const mockedGetSdkConfig = mockGetSdkConfig();
  mockedGetSdkConfig.mockResolvedValue({
    mobileApp: {
      mobileAppUA: 'useragentstrtotest' // Todo: Can be moved to env specific config.
    }
  });
  return mockedGetSdkConfig;
};
