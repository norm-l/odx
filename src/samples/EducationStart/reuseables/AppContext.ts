import { createContext } from 'react';

export interface AppContextValues {
  appBacklinkProps: {
    appBacklinkAction?: Function | null;
    appBacklinkText?: String | null;
  };
  showLanguageToggle?: boolean;
  pageNotWorkingUrl?: string;
}

const AppContext = createContext<AppContextValues>({
  appBacklinkProps: {
    appBacklinkAction: null,
    appBacklinkText: null
  },
  showLanguageToggle: false,
  pageNotWorkingUrl: ''
});

export { AppContext as default };
