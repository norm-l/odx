import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { loginIfNecessary, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import ReadOnlyDisplay from '../../components/BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
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

                            <p className='govuk-body'>Placeholder confirmation text</p>
                            <h2 className='govuk-heading-m'>{t('CLAIMANTS_ENTITLEMENT_DETAILS')}</h2>
                            <p className='govuk-body'>Placeholder if your details are incorrect</p>

                            <dl className='govuk-summary-list'>
                                <ReadOnlyDisplay label='Name' value='A Name'/>                            
                                <ReadOnlyDisplay label='Address' value='123 Street, London, LN12 3ST' name='CSV'/>                            
                                <ReadOnlyDisplay label='Amount' value='$22.00 Per Day'/>                            
                                <ReadOnlyDisplay label='Start date' value='01 June 2024'/>                            
                                <ReadOnlyDisplay label='End Date' value='01 June 2025'/>  
                            </dl>
                            
                            <h2 className='govuk-heading-m'>{t('CLAIMANTS_ENTITLEMENT_DETAILS')}</h2>                          
                            <dl className='govuk-summary-list'>
                                <ReadOnlyDisplay label='Date of birth' value='4 March 2022'/>                            
                                <ReadOnlyDisplay label='Start date' value='01 June 2024'/>                            
                                <ReadOnlyDisplay label='End date' value='01 June 2025'/>  
                            </dl>
                        </div>
                    </div>
                </main>            
            </div>
            <AppFooter />
        </> :
        <></>
    )
}

