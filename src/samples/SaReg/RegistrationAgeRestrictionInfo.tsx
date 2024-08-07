import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';

const RegistrationAgeRestrictionInfo = () => {
  const { t } = useTranslation();
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';

  useEffect(() => {
    setPageTitle();
  }, [lang]);

  return (
    <>
      <MainWrapper showPageNotWorkingLink={false}>
        <h1 className='govuk-heading-l'>{t('CALL_HMRC_TO_REGISTER_FOR_SELF_ASSESSMENT')}</h1>
        <div className='govuk-body'>
          <p className='govuk-body'>{t('YOU_NEED_TO_BE_OLDER_THAN_15_YEARS_AND_9_MONTHS')}</p>
          <p className='govuk-body'>{t('IF_YOU_NEED_TO_REGISTER_CALL_HMRC')}</p>
        </div>
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
      </MainWrapper>
    </>
  );
};

export default RegistrationAgeRestrictionInfo;
