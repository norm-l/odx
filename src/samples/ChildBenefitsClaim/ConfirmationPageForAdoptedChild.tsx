import React from 'react';
import { useTranslation } from 'react-i18next';

const ConfirmationPage = () => {

  const { t } = useTranslation();

  return (
    <main className="govuk-main-wrapper" id="main-content" role="main">
      <div className="govuk-grid-row">
        <div className='govuk-grid-column-two-thirds'>
          <div className='govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-7'>
            <h1 className='govuk-panel__title'> {t("APPLICATION_COMPLETE")}</h1>
            <div className='govuk-panel__body govuk-!-font-size-27'>{t('POST_YOUR_SUPPORTING_DOCUMENTS')}</div>
          </div>
          <h2 className='govuk-heading-m'> {t('WHAT_YOU_NEED_TO_DO_NOW')} </h2>
          <p className='govuk-body'> {t('THE_INFO_YOU_HAVE_PROVIDED')} </p>
          <p className='govuk-body'> {t('YOU_NEED_TO_POST')} </p>
          <ul className="govuk-list govuk-list--bullet">
            <li className='govuk-body'><code>{t('CHILDS_NAME')}</code> {t('BIRTH_CERTIFICATE')} </li>
            <li className='govuk-body'><code>{t('CHILDS_NAME')}</code> {t('PASSPORT_OR_TRAVEL_DOCUMENT')} </li>
            <li className='govuk-body'><code>{t('CHILDS_NAME')}</code> {t('ADOPTION_CERTIFICATE')} </li>
          </ul>
          <p className='govuk-body'> {t('HMRC_MIGHT_CALL_YOU')} </p>
          <p className='govuk-body'> {t('AFTER_YOU_HAVE')} <a href='#'>{t('PRINTED_AND_SIGNED_THE_FORM')} {t('OPENS_IN_NEW_TAB')}</a>, {t('RETURN_THE_FORM_WITH')} </p>
          <p className='govuk-body govuk-!-font-weight-bold'>
            Child Benefit Office (GB)<br/>
            Washington<br/>
            NEWCASTLE UPON TYNE<br/>
            NE88 1ZD
          </p>
          <p className='govuk-body'> {t('WE_NORMALLY_RETURN_DOCUMENTS_WITHIN')} </p>
          <h3 className='govuk-heading-m'>{t('TRACK_YOUR_APPLICATION')}</h3>
          <p className='govuk-body'> {t('YOU_CAN_CHECK_STATUS_USING_THE_LINK')} </p>
          <p className='govuk-body'><a href='#'>{t('RETURN_TO_HOMEPAGE')}</a></p>
          <p className='govuk-body'><a href='#'>{t('WHAT_DID_YOU_THINK_OF_THIS_SERVICE')} </a>{t('TAKES_30_SECONDS')}</p>
        </div>
      </div>
    </main>
  );
};

export default ConfirmationPage;
