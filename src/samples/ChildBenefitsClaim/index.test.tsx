import React from 'react';
import UserPortal from '../ChildBenefitsClaim/UserPortal';
import { waitFor, render } from '@testing-library/react';
import { configure } from '@testing-library/react';
import { mockGetSdkConfigWithBasepath } from '../../../tests/mocks/getSdkConfigMock';
import 'jest-fetch-mock';

configure({ testIdAttribute: 'data-test-id' });

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

describe('UserPortal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Begin new claim button should not render, if user has existing claims', async () => {
    mockGetSdkConfigWithBasepath(); // Common mock

    const { queryByText } = render(
      <UserPortal beginClaim showPortalBanner showBeginNewClaimButton />
    );

    await waitFor(() => {
      expect(queryByText('Begin new claim')).not.toBeInTheDocument();
    });
  });
  test('UserPortal text message should not render, if user has existing claims', async () => {
    mockGetSdkConfigWithBasepath(); // Common mock

    const { queryByText } = render(
      <UserPortal beginClaim showPortalBanner showBeginNewClaimButton />
    );

    await waitFor(() => {
      expect(
        queryByText('You have a submitted claim. You can make another claim after 24 hours.')
      ).not.toBeInTheDocument();
    });
  });
});
