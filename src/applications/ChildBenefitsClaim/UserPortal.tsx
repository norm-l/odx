import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/BaseComponents/Button/Button';

export default function UserPortal(props) {
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
        <p className='govuk-body'>{t('CALL_THE_CHB_HELPLINE')}</p>
        <p className='govuk-body'>You&apos;ll need:</p>
        <ul className='govuk-list govuk-list--bullet'>
          <li> {t('NINUMBER')} </li>
        </ul>
        <ul className='govuk-details__text govuk-list'>
          <li> {t('CHB_HELPLINE')}  </li>
          <li>  {t('TELEPHONE')} : 0300 200 3100</li>
          <li> {t('WELSH_LANGUAGE')}: 0300 200 1900</li>
          <li> {t('TEXTPHONE')}  : 0300 200 3103 </li>
          <li> {t('OUTSIDE_UK')} : +44 161 210 3086</li>
          <li> {t('MONDAY_TO_FRIDAY_8AM_TO_6PM')}, 8am to 6pm</li>
        </ul>

        <span className='govuk-heading-m'> {t('ONLINE')}</span>
        <a className='govuk-link'> {t('ASK_HMRC_ONLINE')}</a>
        <Button
          attributes={{ className: 'govuk-!-margin-top-4' }}
          onClick={beginClaim}
          variant='start'
        >
          {t('BEGIN_NEW_CLAIM')}
        </Button>
      </div>
    </>
  );
}
