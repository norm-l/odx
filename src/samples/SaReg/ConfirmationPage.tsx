import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import useServiceShuttered from '../../components/helpers/hooks/useServiceShuttered';
import ShutterServicePage from '../../components/AppComponents/ShutterServicePage';
import Button from '../../components/BaseComponents/Button/Button';

const ConfirmationPage = ({ caseStatus }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const serviceShuttered = useServiceShuttered();
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  function getFeedBackLink() {
    return '#';
  }
  useEffect(() => {
    setPageTitle();
  }, [lang]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const getPanelContentOfSubmittedReg = () => {
    return (
      <>
        <h1 className='govuk-panel__title'> {t('REGISTRATION_RECEIVED')}</h1>
      </>
    );
  };

  const _clickToTaxAccount = () => {
  }

  const getBodyContentofSubmittedReg = () => {
    return (
      <>
        <p className='govuk-body'> {t('WE_HAVE_SENT_YOUR_APPLICATION')}</p>
        <h2 className='govuk-heading-m'> {t('WHAT_HAPPENS_NEXT')}</h2>
        <p className='govuk-body'> {t('YOU_WILL_SEE_DETAILS_IN_24_HOURS')}</p>
        <p className='govuk-body'> {t('WANT_TO_SEE_MORE_INFO')} {' '}
          <a href='https://www.gov.uk/guidance/download-the-hmrc-app' target='_blank' rel='noreferrer noopener'>
            {t('USE_THE_HMRC_APP')} {t('OPENS_IN_NEW_TAB')}
          </a>
        </p>
        <Button
            attributes={{ className: 'govuk-!-margin-top-4' }}
            variant='primary'
            onClick={() => {
              _clickToTaxAccount();
            }}
          >
          {t('GO_TO_YOUR_TAX_ACCOUNT')}
        </Button> <br />
        <hr className="govuk-section-break govuk-section-break--visible govuk-!-padding-top-2"></hr>
        <h2 className='govuk-heading-m govuk-!-padding-top-6'> {t('YOUR_HMRC_ONLINE_SERVICES')}</h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>{t('SEE_YOUR')} {' '} 
            <a href='' target='_blank' rel='noreferrer noopener'>
              {t('NATIONAL_INSURANCE_CONTRIBUTIONS')} {t('OPENS_IN_NEW_TAB')}
            </a></li>
          <li>{t('VIEW_AN')} {' '}
            <a href='' target='_blank' rel='noreferrer noopener'>
              {t('ESTIMATION_OF_YOUR_STATE_PENSION')} {t('OPENS_IN_NEW_TAB')}
            </a></li>
          <li>{t('UPDATE')} {' '} 
            <a href='' target='_blank' rel='noreferrer noopener'>
              {t('YOUR_ADDRESS')} {t('OPENS_IN_NEW_TAB')}
            </a></li>
        </ul>
        <p className='govuk-body govuk-!-padding-top-6'>
          <a href={getFeedBackLink()} className='govuk-link' target='_blank' rel='noreferrer'>
            {t('WHAT_DID_YOU_THINK_OF_THIS_SERVICE')} {t('OPENS_IN_NEW_TAB')}
          </a>
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

  if (loading && caseStatus === undefined) {
    return null;
  } else if (serviceShuttered) {
    return <ShutterServicePage />;
  } else {
    return (
      <>
        <MainWrapper>
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
