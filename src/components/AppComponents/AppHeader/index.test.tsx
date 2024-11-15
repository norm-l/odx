import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppHeader from '.';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn().mockResolvedValue({
    serverConfig: {
      sdkContentServerUrl: 'https://localhost:3502/',
      sdkHmrcURL: 'https://hmrc.gov.uk'
    },
    mobileApp: {
      mobileAppUserAgent: 'hmrcnextgenconsumer'
    }
  })
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key })
}));

// jest.mock ('react-device-detect', () => ({
//   CustomView: ({ condition, children }) => (condition ? children : null),
//   getUA:
//     'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
// }));

const userAgentFn = jest.createMockFromModule<any>('react-device-detect');

userAgentFn.getUA = 'Test';

userAgentFn.CustomView = ({ condition, children }) => (condition ? children : null);

describe('<AppHeader />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // set defaults
  const props = {
    handleSignout: jest.fn(),
    appname: 'Test App',
    hasLanguageToggle: true,
    languageToggleCallback: jest.fn()
  };

  test('Renders the AppHeader component', async () => {
    let container;
    await act(async () => {
      ({ container } = render(<AppHeader {...props} />));
    });
    const appHeaderElement = await waitFor(() => container.querySelector('header'));

    expect(appHeaderElement).toBeInTheDocument();
  });

  test("The header component IS rendered if the given string from the SDK config ISN'T in the User Agent String", async () => {
    let container;
    await act(async () => {
      ({ container } = render(<AppHeader {...props} />));
    });

    // Assuming CustomView renders a div, we can check if the div exists
    const customViewElement = await waitFor(() => container.querySelector('header'));

    // Check if the condition is applied correctly
    expect(customViewElement).toBeInTheDocument();
  });

  // test("The header component ISN'T rendered if the given string from the SDK config IS in the User Agent String", async () => {
  //   jest.mock('react-device-detect', () => ({
  //     getUA:
  //       'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) hmrcnextgenconsumer AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  //   }));
  //   let container;
  //   await act(async () => {
  //     ({ container } = render(<AppHeader {...props} />));
  //   });

  //   // Assuming CustomView renders a div, we can check if the div exists
  //   const customViewElement = await waitFor(() => container.querySelector('header'));

  //   // Check if the condition is applied correctly
  //   expect(customViewElement).not.toBeInTheDocument();
  // });

  // test("The header component ISN'T rendered if the given string from the SDK config IS in the User Agent String", async () => {
  //   const getUA =
  //     'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) test-mobile-user-agent AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
  //   const {
  //     mobileApp: { mobileAppUserAgent: mobileAppUA }
  //   } = await import('@pega/auth/lib/sdk-auth-manager').then(module => module.getSdkConfig());

  //   console.log(mobileAppUA);

  //   const { container } = render(
  //     <CustomView condition={!getUA.toLocaleLowerCase().includes(mobileAppUA)} />
  //   );

  //   // Assuming CustomView renders a div, we can check if the div exists
  //   const customViewElement = await waitFor(() => container.querySelector('header'));

  //   // Check if the condition is applied correctly
  //   expect(customViewElement).toBeNull();
  // });
});

// // index.test.tsx
// import React from 'react';
// import { render, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import { CustomView } from 'react-device-detect';

// describe('<CustomView />', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('Renders contents (AppHeader) only when not inside the mobile app', async () => {
//     const getUA =
//       'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
//     const mobileAppUA = 'iphone';

//     const { container } = render(
//       <CustomView condition={!getUA.toLocaleLowerCase().includes(mobileAppUA)} />
//     );

//     // Assuming CustomView renders a div, we can check if the div exists
//     const customViewElement = await waitFor(() => container.querySelector('div'));

//     // Check if the condition is applied correctly
//     expect(customViewElement).not.toBeInTheDocument();
//   });

//   test("Don't render the header within the mobile app", async () => {
//     const getUA =
//       'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
//     const mobileAppUA = 'iphone';

//     const { container } = render(
//       <CustomView condition={getUA.toLocaleLowerCase().includes(mobileAppUA)} />
//     );

//     // Assuming CustomView renders a div, we can check if the div exists
//     const customViewElement = await waitFor(() => container.querySelector('div'));

//     // Check if the condition is applied correctly
//     expect(customViewElement).toBeInTheDocument();
//   });
// });
