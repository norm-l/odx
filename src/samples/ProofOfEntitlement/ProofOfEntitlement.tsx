import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginIfNecessary, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import ReadOnlyDisplay from '../../components/BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

declare const PCore;
declare const myLoadMashup: any;

export default function ProofOfEntitlement(){

    const [entitlementData, setEntitlementData] = useState(null);
    const [nino, setNino] = useState('PA003371D')
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
        document.addEventListener('SdkConstellationReady', () => {
            
            myLoadMashup('pega-root', false);
            PCore.onPCoreReady(() => {
                PCore.getDataPageUtils()
                .getPageDataAsync('D_GetChBEntitlement', 'root', {
                    NINO: nino          
                }, ).then((result) =>
                {
                    setEntitlementData(result);
                    console.log(`res ${result}`)
                }).catch((error) => {
                    console.log(`error ${error}`)
                } )
        })})
    }, [])


     useEffect( () => {
        if (typeof PCore !== 'undefined' && nino) {
            PCore.getDataPageUtils()
            .getPageDataAsync('D_GetChBEntitlement', 'root', {
                NINO: nino          
            },{
                invalidateCache:true
            }
            ).then((result) =>
            {
                setEntitlementData({...result});                
                setNino(null);
                console.log(`res ${result}`)
            }).catch((error) => {
                console.log(`error ${error}`)
            } )
        }
    }, [nino])
        
    return (
        sdkIsLoggedIn() && entitlementData ?
        <>        
            <AppHeader hasLanguageToggle={true} />
            <div className='govuk-width-container'>
                <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <h1 className="govuk-heading-l">{t('PROOF_ENTITLEMENT_HEADING')}</h1>

                            <p className='govuk-body'>{t('PROOF_ENTITLEMENT_CONFIRMATION')} {entitlementData.Claimant?.pyFullName} {t('ON')} {dayjs().format('D MMMM YYYY')}</p>
                            <h2 className='govuk-heading-m'>{t('PROOF_ENTITLEMENT_DETAILS_H2')}</h2>
                            <p className='govuk-body'>{t('PROOF_ENTITLEMENT_IF_DETAILS_INCORRECT')}{' '}
                            <a href="https://www.gov.uk/report-changes-child-benefit/if-your-familys-circumstances-change" className="govuk-link" target="_blank" rel="noreferrer noopener">{t("PROOF_ENTITLEMENT_IF_DETAILS_INCORRECT_CHANGE_YOUR_CIRCUSMSTANCES_LINK")}{t("OPENS_IN_NEW_TAB")}</a>                          
                            {' '}{t("PROOF_ENTITLMENT_IF_DETAILS_INCORRECT_OR_ABOUT")}{' '}
                            <a href="https://www.gov.uk/report-changes-child-benefit" className="govuk-link" target="_blank" rel="noreferrer noopener">{t("PROOF_ENTITLEMENT_IF_DETAILS_INCORRECT_CHANGE_CHILDS_CIRCUMSTANCES_LINK")}{t("OPENS_IN_NEW_TAB")}</a>
                            {t("PROOF_ENTITLMENT_IF_DETAILS_INCORRECT_WILL_UPDATE")}
                            </p>

                            <dl className='govuk-summary-list'>
                                <ReadOnlyDisplay key='name' label={t('POE_LABEL_NAME')} value={entitlementData.Claimant?.pyFullName}/>                                                            
                                <ReadOnlyDisplay key='address' label={t('POE_LABEL_ADDRESS')} value={entitlementData.Claimant?.pyAddress} name={entitlementData.Claimant?.pyAddress.indexOf(',')?'CSV':''}/>                            
                                <ReadOnlyDisplay key='amount' label={t('POE_LABEL_AMOUNT')} value={`£${entitlementData.AwardValue?.toString()} ${t('PER_WEEK')}`}/>                            
                                <ReadOnlyDisplay key='startdate' label={t('POE_LABEL_START_DATE')} value={dayjs(entitlementData.AwardStart).format('D MMMM YYYY')}/>                            
                                <ReadOnlyDisplay key='enddate' label={t('POE_LABEL_END_DATE')} value={dayjs(entitlementData.AwardEnd).format('D MMMM YYYY')}/>  
                            </dl>
                            
                            {entitlementData.Children?.map((childData) => {
                                return(
                                    <React.Fragment key={childData?.pyFullName}>
                                        <h2 className='govuk-heading-m'>{t('CHILD_BENEFIT_DETAILS_FOR')} {childData?.pyFullName}</h2> 
                                        <dl className='govuk-summary-list'>
                                            <ReadOnlyDisplay key={`${childData?.pyFullName} dob`} label={t('POE_LABEL_CHILD_DOB')} value={dayjs(childData.DateOfBirth).format('D MMMM YYYY') || ''}/>                            
                                            <ReadOnlyDisplay key={`${childData?.pyFullName} start`} label={t('POE_LABEL_START_DATE')} value={dayjs(childData.EligibilityStart).format('D MMMM YYYY') || ''}/>                            
                                            <ReadOnlyDisplay key={`${childData?.pyFullName} end`} label={t('POE_LABEL_END_DATE')} value={dayjs(childData.EligibilityEnd).format('D MMMM YYYY') || ''}/>  
                                        </dl>
                                    </React.Fragment>
                                )
                                })
                            }
                        </div>
                    </div>
                </main>            
            </div>
            <AppFooter />
        </> :
        <></>
    )
}
