import { createContext } from 'react';
// Todo: Move the context at top level
export interface AppContextValues {
  appBacklinkProps: {
    appBacklinkAction?: Function | null;
    appBacklinkText?: String | null;
  };
  showLanguageToggle?: boolean;
  serviceParam?: string;
  serviceName?: string;
  appNameHeader?: string;
}
// TODO: Once this code exposed to common folder, we will refer AppContext from reuseable components
const AppContextEducation = createContext<AppContextValues>({
  appBacklinkProps: {
    appBacklinkAction: null,
    appBacklinkText: null
  },
  showLanguageToggle: false,
  serviceParam: '',
  serviceName: '',
  appNameHeader: ''
});

export { AppContextEducation as default };
