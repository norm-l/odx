import React from 'react';
import { useTranslation } from 'react-i18next';


export default function ServiceNotAvailable(props) {
  const {returnToPortalPage } = props;
  const mystyle = {
  fontSize: "19px"
  };
 
  const { t } = useTranslation();
  return (
   
    <div className='govuk-body govuk-!-margin-bottom-9'>
         <h1 className="govuk-heading-l">{t('SERVICE_NOT_AVAILABLE')}</h1>
         <p className="govuk-body">{t('COME_BACK_LATER')}</p>
        <a href="#" className="govuk-link " onClick={returnToPortalPage} >{t('RETURN_TO_THE_HOMEPAGE')}</a>
    
                  
    </div>
  );
}

