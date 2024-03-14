import React from 'react';
import Button from '../../components/BaseComponents/Button/Button';


export default function StartPage(props) {

    function startCase() {
        PCore.getMashupApi().createCase('HMRC-ChB-Work-HICBCPreference', PCore.getConstants().APP.APP);      
    }

    function startCasechb() {
        PCore.getMashupApi().createCase('HMRC-ChB-Work-Claim', PCore.getConstants().APP.APP);      
    }

    return <>
        <div>High Income Claim</div>
        <div>You can opt in or out of HICBC Here</div>


        <Button variant='start' onClick={props.onStart}>New claim</Button>        
        
    </>
};