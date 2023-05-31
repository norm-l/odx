import {useState, useEffect} from 'react';

declare const PCore;

/**
 * Helper hook for handling instances where there is only one field presented in the current view.
 * Returns a boolean indicating whether or not there is only one field to display in the current context
*/


export default function useIsOnlyField(thePConn, effectTriger = null){
  // const [hidePageLabel, setHidePageLabel] = useState(thePConn.getDataObject().caseInfo.content.HidePageLabel === undefined? false : true);

  // useEffect(()=>{
  //   setHidePageLabel(thePConn.getDataObject().caseInfo.content.HidePageLabel === undefined? false : true);
  // },[effectTriger])
  if(thePConn.getDataObject().caseInfo.content.HidePageLabel === undefined){
    return false;
  }else{
    return true;
  }

}
