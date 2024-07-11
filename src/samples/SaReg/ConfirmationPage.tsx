import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import useServiceShuttered from '../../components/helpers/hooks/useServiceShuttered';
import ShutterServicePage from '../../components/AppComponents/ShutterServicePage';
// import Button from '../../components/BaseComponents/Button/Button';

const ConfirmationPage = ({ isSoleTrader }) => {
  const { t } = useTranslation();
  const serviceShuttered = useServiceShuttered();
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  useEffect(() => {
    setPageTitle();
  }, [lang]);

  const getPanelContentOfSubmittedReg = () => {
    return (
      <>
        <h1 className='govuk-panel__title'> {t('REGISTRATION_RECEIVED')}</h1>
      </>
    );
  };

  const getBodyContentofSubmittedReg = () => {
    return (
      <>
        <p className='govuk-body'> {t('YOU_WILL_GET_A_MESSAGE_TO_CONFIRM')}</p>
        <h2 className='govuk-heading-m'> {t('WHAT_HAPPENS_NEXT')}</h2>
        <p className='govuk-body'> {t('AFTER_YOUR_REGISTRATION_HAS_BEEN_PROCESSED')}</p>
        {isSoleTrader && (
          <p className='govuk-body'>{t('YOU_WILL_ALSO_BE_REGISTERED_FOR_CLASS_2')}</p>
        )}
        <p className='govuk-body'>{t('THIS_USUALLY_HAPPENS_WITHIN_24_HOURS')}</p>
        <p className='govuk-body'>{t('YOU_WILL_ALSO_RECEIVE_A_LETTER_BY_POST')}</p>
        <h2 className='govuk-heading-m'> {t('WHAT_YOU_NEED_TO_DO')}</h2>
        <p className='govuk-body'> {t('REGISTERING_FOR_SELF_ASSESSMENT_MEANS')}</p>
        <p className='govuk-body'>{t('YOU_STILL_NEED_TO_SEND_A_TAX_RETURN')}</p>
        <h2 className='govuk-heading-m'> {t('IF_YOU_NO_LONGER_NEED_TO_BE_IN_SA')}</h2>
        <p className='govuk-body'> {t('YOU_NEED_TO_TELL_US_YOU_NO_LONGER')}</p>
        <p className='govuk-body'>{t('IF_YOU_DO_NOT_SEND_A_TAX_RETURN')}</p>
        <p className='govuk-body'>
          {t('YOU_CAN_ALSO')}
          <a
            href='https://www.gov.uk/guidance/download-the-hmrc-app'
            className='govuk-link'
            target='_blank'
            rel='noreferrer'
          >
            {t('USE_THE_HMRC_APP')}
            <span className='govuk-visually-hidden'>{t('OPENS_IN_NEW_TAB')}</span>
          </a>
          {t('TO_READ_MORE_ABOUT_SELF_ASSESSMENT')}
        </p>
        <p className='govuk-body'>
          <a
            href='https://www.tax.service.gov.uk/personal-account/profile-and-settings'
            className='govuk-link'
            target='_blank'
            rel='noreferrer noopener'
          >
            {t('GO_TO_YOUR_TAX_ACCOUNT')}
            <span className='govuk-visually-hidden'>{t('OPENS_IN_NEW_TAB')}</span>
          </a>
        </p>
        <br />
        <p className='govuk-body govuk-!-padding-top-6'>
          <a
            href='https://www.tax.service.gov.uk/feedback/ODXSAREG'
            className='govuk-link'
            target='_blank'
            rel='noreferrer'
          >
            {t('WHAT_DID_YOU_THINK_OF_THIS_SERVICE')}
            <span className='govuk-visually-hidden'>{t('OPENS_IN_NEW_TAB')}</span>
          </a>
          {t('TAKES_30_SECONDS')}
        </p>
      </>
    );
  };

  const getPanelContent = () => {
    return getPanelContentOfSubmittedReg();
  };

  const getBodyContent = () => {
    return getBodyContentofSubmittedReg();
  };

  if (serviceShuttered) {
    return <ShutterServicePage />;
  } else {
    return (
      <>
        <MainWrapper showPageNotWorkingLink={false}>
          <div className='govuk-panel govuk-panel--confirmation govuk-!-padding-bottom-9 govuk-!-margin-bottom-7'>
            {getPanelContent()}
          </div>
          {getBodyContent()}
        </MainWrapper>
      </>
    );
  }
};

export default ConfirmationPage;
