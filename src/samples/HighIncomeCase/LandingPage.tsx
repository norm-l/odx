import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import  MainWrapper   from '../../components/BaseComponents/MainWrapper';
import  Button from '../../components/BaseComponents/Button/Button';
import AppHeader from './reuseables/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import AppContext from './reuseables/AppContext';
import WarningText from './reuseables/WarningText/WarningText';

export default function LandingPage(props){
    const {onProceedHandler} = props;    
    const {showLanguageToggle} = useContext(AppContext); 

    const { hmrcURL } = useHMRCExternalLinks();

    useEffect(() => {
        setPageTitle()
    })

    const {t} = useTranslation()   

    const onContinue = () => {
        onProceedHandler();
    }    
    
    return (
        <>
            <AppHeader
                appname={t('HICBC_APP_NAME')}
                hasLanguageToggle={showLanguageToggle}
                betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=463&referrerUrl=${window.location}`}                  
            />
            <div className='govuk-width-container'>                
                <MainWrapper>
                    <h1 className="govuk-heading-xl">{t('HICBC_LANDINGPAGE_HEADING')}</h1>
                    <p className="govuk-body"> {t("HICBC_LANDINGPAGE_P1")}</p>
                    <p className="govuk-body"> {t("HICBC_LANDINGPAGE_P2")}</p>
                    <ul className="govuk-list govuk-list--bullet">
                        <li>{t("HICBC_LANDINGPAGE_LISTITEM_BE_CHB_CLAIMANT")}</li>
                        <li>{t("HICBC_LANDINGPAGE_LISTITEM_STILL_ELIGIBLE")}{' '}
                            <a className='govuk-link' href='https://www.gov.uk/child-benefit/eligibility' target="_blank" rel="noreferrer noopener">
                                {t("HICBC_LANDINGPAGE_LISTITEM_STILL_ELIGIBLE_LINK_TEXT")} {t("OPENS_IN_NEW_TAB")}
                            </a>    
                        </li>                        
                        <li>{t("HICBC_LANDINGPAGE_LISTITEM_OPT_IN_WITHIN_3_MONTHS")}</li>
                        <li>{t("HICBC_LANDINGPAGE_LISTITEM_HAVE_PAYMENT_DETAILS_AVAILABLE")}</li>
                    </ul>     
                    <WarningText className="govuk-body"> {t("HICBC_LANDINGPAGE_WARNING_CAN_ONLY_BE_COMPLETED_BY_CLAIMANT")}</WarningText>         
                    <Button id='startNow' onClick={onContinue} variant='start'>{t("START_NOW")}</Button>
                    <br />
                </MainWrapper>
            </div>
            <AppFooter />
        </>
    )
}