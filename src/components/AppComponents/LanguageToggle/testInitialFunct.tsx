import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import  { getPConnect  } from '@pega/pcore-pconnect-typedefs'
//import  getPConnect   from '../../../../node_modules/@pega/pcore-pconnect-typedefs/index';

console.log('REACT: test Initial composure fired')
//node_modules\@pega\pcore-pconnect-typedefs\index.d.ts
//const thePConn = getPConnect();


declare const PCore: any;
//console.log('pcode version -- ', PCore.getPCoreVersion());

export default function _test(props) {
 // const { getPConnect } = props;
  console.log('React: _test starting getPConnect')
  const thePConn = getPConnect();
  console.log('React: _test finished getPConnect')
// Define the function outside of any component

    const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';

  console.log('REACT: _test Langiage Call Fired!!');
  const config = { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' };
  console.log("REACT: _test passed config")
//PCore.getMashupApi()
//const processActionPromise = thePConn.getActionsApi.openProcessAction(config[lang], {  
const processActionPromise = thePConn.getActionsApi().openProcessAction(config[lang], {
    caseID: getPConnect().getCaseInfo()?.getKey(),
    type: 'Case'
  });
}

//export default _test;