import React from 'react';
import { useTranslation } from 'react-i18next';

const AskHMRC = () => {
  const { t } = useTranslation();
  return (
    <>
      <hr className='govuk-section-break govuk-section-break--l govuk-section-break--visible'></hr>
      <h2 className='govuk-heading-m'>{t('GET_HELP')}</h2>
      <p>
        {t('USE')}{' '}
        <a
          href='https://www.tax.service.gov.uk/ask-hmrc/chat/self-assessment'
          rel='noreferrer noopener'
          target='_blank'
          className='govuk-link'
        >
          {t('HRMC_ONLINE_ASSISTANT')}
        </a>{' '}
        {t('TO_GET_HELP_WITH_REGISTRATION')}
      </p>
    </>
  );
};

export default AskHMRC;
