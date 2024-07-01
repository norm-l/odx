import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { loginIfNecessary, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';


export default function ProofOfEntitlement(){

    const history = useHistory();
    const {t} = useTranslation();

    const onRedirectDone = ()=>{
        history.push('/view-proof-entitlement');
        // appName and mainRedirect params have to be same as earlier invocation
        loginIfNecessary({ appName: 'embedded', mainRedirect: true });   
    }

    useEffect( () => {
        if(!sdkIsLoggedIn()){
            loginIfNecessary({ appName: 'embedded', mainRedirect: true, redirectDoneCB: onRedirectDone });
        }  
    }, [])


    return (
        sdkIsLoggedIn() ? <>        
            <AppHeader />
            <div className='govuk-width-container'>
                <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <h1 className="govuk-heading-l">{t('PROOF_ENTITLEMENT_HEADING')}</h1>
                        </div>
                    </div>
                </main>            
            </div>
            <AppFooter />
        </> :
        <></>
    )
}

