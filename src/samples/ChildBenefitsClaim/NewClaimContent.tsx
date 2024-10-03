import React from 'react';
import Button from '../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';

export default function NewClaimContent(props) {
  const { beginClaim } = props;
  const { t } = useTranslation();
  return (
    <>
      <p className='govuk-body'>{t('USE_THIS_SERVICE')}</p>
      <p className='govuk-body'>{t('WE_MAY_CALL_YOU')}</p>
      <Button attributes={{ className: 'govuk' }} onClick={beginClaim} variant='start'>
        {t('BEGIN_NEW_CLAIM')}
      </Button>
    </>
  );
}
