import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/BaseComponents/Button/Button';

export default function UserPortal(props){

  const { beginClaim, children } = props;
  const { t } = useTranslation();

  return (
    <>
      <div className='govuk-grid-column-two-thirds'>
        <h1 className='govuk-heading-xl'>{t('YOUR_CLAIM_APPLICATIONS')}</h1>
      </div>
      <div className='govuk-grid-column-two-thirds'>
        <p className='govuk-body'>{t('CLAIM_LISTING_DESCRIPTION')}</p>
        {children}
      </div>
      <div className='govuk-grid-column-one-third'>
        <span className='govuk-heading-m'>Online</span>
        <a className='govuk-link'>Ask HMRC online</a>
        <Button
          attributes={{ className: 'govuk-!-margin-top-4' }}
          onClick={beginClaim}
          variant='start'
        >
          Begin New Claim
        </Button>
      </div>
    </>
  );
}
