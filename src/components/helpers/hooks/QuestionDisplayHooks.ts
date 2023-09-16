import {useContext} from 'react';
import {DefaultFormContext, HMRCAppContext} from '../../helpers/HMRCAppContext';
/**
 * Helper hook for handling instances where there is only one field presented in the current view.
 * Returns a boolean indicating whether or not there is only one field to display in the current context
*/

/* Retaining this code for future change in implementation of single question pages. */


export default function useIsOnlyField(callerDisplayOrder = null){
    const DFContext = useContext(DefaultFormContext);
    const AssignmentContext = useContext(HMRCAppContext);

    if(AssignmentContext.DFCounter.includes(DFContext.DFName)){
        return callerDisplayOrder === "0" ? DFContext.displayAsSingleQuestion : false;
    } else {
        return AssignmentContext.singleQuestionPage;
    }
    /*if(!DFContext.displayAsSingleQuestion){
        if(DFContext.DFOrder !== 0){
            return false;
        } else {}

    }*/

}
