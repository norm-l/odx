import dayjs from 'dayjs';
import React, { createContext, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import setPageTitle from '../components/helpers/setPageTitleHelpers';
import i18n from '../config/i18n';

interface iLanguageContext {
  currentLanguage: string;
  setCurrentLanguage: Dispatch<SetStateAction<string>>;
  // eslint-disable-next-line no-unused-vars
  toggleNotificationProcess: (lang: string, PConnectObject: any) => Promise<any>;
}

export const LanguageContext = createContext<iLanguageContext>(undefined);

const LanguageContextProvider = ({ children }) => {
  const currentLang = sessionStorage.getItem('rsdk_locale')?.slice(0, 2) || 'en';
  const [currentLanguage, setCurrentLanguage] = useState(currentLang);
  const [pegaBundles, setPegaBundles] = useState([]);

  function toggleNotificationProcess(lang, PConnectObject: any): Promise<any> {
    console.log('TOGGLE toggleNotificationProcess >>>>> ', lang);
    const config = { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' };
    if (config[lang] && PConnectObject) {
      return PConnectObject.getActionsApi().openProcessAction(config[lang], {
        caseID: PConnectObject.getDataObject().caseInfo.ID,
        type: 'Case'
      });
    }
  }

  async function getPegaBundles() {
    // Fetch Locale Reference names for data pages
    const datapageKeys = Object.keys(PCore.getDataPageUtils().datastore);
    const dataPageBundleNames = datapageKeys.map(dpageName => {
      return `@BASECLASS!DATAPAGE!${dpageName.toUpperCase()}`;
    });
    const bundles = [
      PCore.getLocaleUtils().GENERIC_BUNDLE_KEY,
      '@BASECLASS!DATAPAGE!D_LISTREFERENCEDATABYTYPE',
      '@BASECLASS!DATAPAGE!D_SCOPEDREFERENCEDATALISTBYTYPE'
    ];

    // The containers are nested at different levels so first we fidn the active primary container (as there could be multiple)
    const activePrimaryContainer = PCore.getContainerUtils().getActiveContainerItemName(
      `${PCore.getConstants().APP.APP}/primary`
    );
    // and then fetch the actice workarea in that primary container
    const activeWorkarea = PCore.getContainerUtils().getActiveContainerItemName(
      `${activePrimaryContainer}/workarea`
    );

    // Current assignment id is stored in the stores case info. Assignments is a list of assignments, as I think it's possible for an operator to have
    // other assignments if the case spins off a secondary task for example (but don't think this is relevant for any of our claims)
    const AssignmentID = PCore.getStoreValue('.assignments[0].ID', '.caseInfo', activeWorkarea);

    if (AssignmentID) {
      if (currentLanguage !== 'en') {
        const newBundlesResponse = await PCore.getRestClient().invokeRestApi(
          'openAssignment',
          {
            body: {},
            headers: {},
            cancelTokenSource: {},
            queryPayload: { assignmentID: AssignmentID }
          },
          activeWorkarea
        );
        const newBundles = newBundlesResponse.data.uiResources.localeReferences;
        return [...newBundles, ...bundles, ...dataPageBundleNames];
      } else {
        return [...bundles, ...dataPageBundleNames];
      }
    } else {
      console.log('No asdsigment id');
    }
  }

  useEffect(() => {
    // this is updating when the language changes...
    sessionStorage.setItem('rsdk_locale', `${currentLanguage}_GB`);
    dayjs.locale(currentLanguage);
    i18n.changeLanguage(currentLanguage);
    document.documentElement.lang = currentLanguage;
    setPageTitle();

    if (typeof PCore !== 'undefined') {
      getPegaBundles().then(bundles => {
        console.log('before');
        console.log(bundles);
        console.log('locale:', PCore.getEnvironmentInfo().locale);
        console.log('storage:', PCore.getLocaleUtils().localeStore);

        PCore.getEnvironmentInfo().setLocale(`${currentLanguage}_GB`); // set local so that the load is correct
        PCore.getLocaleUtils().resetLocaleStore();
        PCore.getLocaleUtils().loadLocaleResources(bundles);

        console.log('AFTER');
        console.log('locale:', PCore.getEnvironmentInfo().locale);
        console.log('storage:', PCore.getLocaleUtils().localeStore);

        PCore.getPubSubUtils().publish('languageToggleTriggered', {
          language: currentLanguage,
          localeRef: bundles
        });
      });
    } else {
      console.log('can not load bundles');
    }
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, setCurrentLanguage, toggleNotificationProcess }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContextProvider;
