import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useStartMashup } from '../HighIncomeCase/reuseables/PegaSetup';
import { loginIfNecessary, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';


export default function ChildBenefitHub(){

    const history = useHistory();

    const onRedirectDone = ()=>{
        history.push('/home');
        // appName and mainRedirect params have to be same as earlier invocation
        loginIfNecessary({ appName: 'embedded', mainRedirect: true });   
    }

    useEffect( () => {
        if(!sdkIsLoggedIn()){
            loginIfNecessary({ appName: 'embedded', mainRedirect: true, redirectDoneCB: onRedirectDone });
        }  
    }, [])

    //useStartMashup(()=>{}, onRedirectDone, {});

    return <>Child Benefit Hub</>
}
