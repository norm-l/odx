/** ************************
* Returns a function to handle switching of Notification Language within a Pega Claim using the 2nd process
* defined in document attached to US-12624 (TODO: Host documentation in Common Component Documentation Catalogue)
*
* params:
*   config - object linking language codes to respective language switch processes
*   PConnectObject - assignment level PConnectObject used to call processAction   
*
* Expects a config object to link languages to respective process, e.g. 
* to handle switching to welsh, where the Process action to do so is named SwitchLanguageToWelsh,
*     and switching to english, where the PRocess action to do so is named SwitchLanguageToEnglish
* the config object would look like:
*
*   {en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh'}
*
* (The returned callback is expected to be called in the LanguageToggle component, where it will be called with the selecte language code, 
* and a Pconnect object)
*/
import React, { useContext, useEffect, useState } from 'react';

function toggleNotificationProcess(config, PConnectObject) {
    console.log("React: toggleNotificationLanguage.tsx Fired")
    
    return (lang) => {
        console.log("React toggleNotificationLanguage.tsx currnet Lang ", config[lang])
        if(config[lang] && PConnectObject){
            PConnectObject.getActionsApi().openProcessAction( config[lang], {caseID: PConnectObject.getDataObject().caseInfo.ID, type:'Case'})
          //  PConnectObject.getActionsApi().openProcessAction( config[lang], { caseID: PConnectObject.getDataObject().getCaseInfo()?.getKey()})//.caseInfo.ID,//
            console.log("React: toggleNotificationLanguage.tsx Fired, lang is: ", config[lang])
            toggleLanguageCall(config, PConnectObject);
        }         
            toggleLanguageCall(config, PConnectObject);       
    }   
        
    function toggleLanguageCall(config, PConnectObject) {
        console.log("REACT: toggleLanguageCall Language call")
       // const config = { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' };
     return(lang) => {
        const processActionPromise = PConnectObject.getActionsApi().openProcessAction(config[lang], {
          caseID: PConnectObject.getCaseInfo()?.getKey(),
          type: 'Case'
        });
    
        processActionPromise.catch(err => {
          // eslint-disable-next-line no-console
          console.log(`Initial language not set: ${err}`);
        });
      }
    }

};


/*
  console.log("React: firing render ")
        const processActionPromise = PConnectObject.getActionsApi().openProcessAction( config[lang], {
          caseID: PConnectObject.getDataObject().caseInfo.ID,//.getCaseInfo()?.getKey(),
          type: 'Case'
        });
    
        processActionPromise.catch(err => {
          // eslint-disable-next-line no-console
          console.log(`Initial language not set: ${err}`);
        });  
*/

export default toggleNotificationProcess;