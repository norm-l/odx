import { createContext } from 'react';

export interface AppContextValues {
  appBacklinkProps1: {
    appBacklinkAction?: Function | null;
    appBacklinkText?: String | null;
  };
  showLanguageToggle?: boolean;
  pageNotWorkingUrl?: string;
}

const AppContext1 = createContext<AppContextValues>({
  appBacklinkProps1: {
    appBacklinkAction: null,
    appBacklinkText: null
  },
  showLanguageToggle: false,
  pageNotWorkingUrl: ''
});

export { AppContext1 as default };
