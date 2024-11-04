import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/cy';
import setPageTitle from '../../helpers/setPageTitleHelpers';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
declare const PCore: any;

const LanguageToggle = props => {
  // const { languageToggleCallback } = props;
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(
    sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en'
  );
  console.log('LanguageToggle', language);
  const [resourcebundles, setResourceBundles] = useState([]);

  console.log('STATE IN THE LNAGUAGE TOGGLE: ', PCore.getStore().getState());

  // const changeLanguage = async e => {
  //   e.preventDefault();
  //   const selectedLanguage = e.currentTarget.getAttribute('lang');
  //   document.documentElement.lang = selectedLanguage;
  //   setSelectedLang(selectedLanguage);
  //   sessionStorage.setItem('rsdk_locale', `${selectedLanguage}_GB`);
  //   dayjs.locale(selectedLanguage);
  //   i18n.changeLanguage(selectedLanguage).then(() => {
  //     setPageTitle();
  //   });
  //   PCore.getEnvironmentInfo().setLocale(`${selectedLanguage}_GB`);
  //   PCore.getLocaleUtils().resetLocaleStore();
  //   console.log('BEFORE RESET:', Object.keys(PCore.getLocaleUtils().localeStore));

  //   if (typeof PCore !== 'undefined') {
  //     const activePrimaryContainer = PCore.getContainerUtils().getActiveContainerItemName(
  //       `${PCore.getConstants().APP.APP}/primary`
  //     );
  //     const activeWorkArea = PCore.getContainerUtils().getActiveContainerItemName(
  //       `${activePrimaryContainer}/workarea`
  //     );
  //     const assignmentID = PCore.getStoreValue('.assignments[0].ID', '.caseInfo', activeWorkArea);
  //     if (assignmentID) {
  //       const bundlesResponse = await PCore.getRestClient().invokeRestApi(
  //         'openAssignment',
  //         {
  //           queryPayload: { assignmentID }
  //         },
  //         activePrimaryContainer
  //       );

  //       const languageBundles = bundlesResponse.data.uiResources.localeReferences;
  //       const bundles = [
  //         PCore.getLocaleUtils().GENERIC_BUNDLE_KEY,
  //         '@BASECLASS!DATAPAGE!D_LISTREFERENCEDATABYTYPE',
  //         '@BASECLASS!DATAPAGE!D_SCOPEDREFERENCEDATALISTBYTYPE',
  //         'HMRC-CHB-WORK-CLAIM!CASE!CLAIM'
  //       ];

  //       setResourceBundles([...bundles, ...languageBundles]);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   PCore.getLocaleUtils().loadLocaleResources(resourcebundles);

  //   PCore.getPubSubUtils().publish('languageToggleTriggered', {
  //     language: selectedLang,
  //     localeRef: []
  //   });
  //   if (languageToggleCallback) {
  //     languageToggleCallback(selectedLang);
  //   }
  // }, [resourcebundles]);

  // // Initialises language value in session storage, and for dayjs
  // useEffect(() => {
  //   document.addEventListener('SdkConstellationReady', () => {
  //     PCore.onPCoreReady(() => {
  //       PCore.getPubSubUtils().subscribe(
  //         PCore.getConstants().PUB_SUB_EVENTS.EVENT_EXPRESS_LOCALACTION,
  //         data => {
  //           setResourceBundles(data.submitResponse.uiResources.localeReferences);
  //         }
  //       );
  //     });
  //   });

  //   if (!sessionStorage.getItem('rsdk_locale')) {
  //     sessionStorage.setItem('rsdk_locale', `en_GB`);
  //     dayjs.locale('en');
  //   } else {
  //     const currentLang = sessionStorage.getItem('rsdk_locale').slice(0, 2).toLowerCase();
  //     dayjs.locale(currentLang);
  //   }
  // }, []);

  return (
    <nav id='hmrc-language-toggle' className='hmrc-language-select' aria-label='Language switcher'>
      <ul className='hmrc-language-select__list'>
        <li className='hmrc-language-select__list-item'>
          {language === 'en' ? (
            <span aria-current='true'>English</span>
          ) : (
            <a href='#' onClick={() => setLanguage('en')} rel='alternate' className='govuk-link'>
              <span className='govuk-visually-hidden'>Change the language to English</span>
              <span aria-hidden='true'>English</span>
            </a>
          )}
        </li>
        <li className='hmrc-language-select__list-item'>
          {language === 'cy' ? (
            <span aria-current='true'>Cymraeg</span>
          ) : (
            <a
              href='#'
              onClick={() => setLanguage('cy')}
              lang='cy'
              rel='alternate'
              className='govuk-link'
            >
              <span className='govuk-visually-hidden'>Newid yr iaith ir Gymraeg</span>
              <span aria-hidden='true'>Cymraeg</span>
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default LanguageToggle;
