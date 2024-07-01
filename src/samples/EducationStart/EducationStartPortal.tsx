import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import NotificationBanner from '../../components/BaseComponents/NotificationBanner/NotificationBanner';

export default function EducationStartPortal(props) {
  const { showPortalBanner, children } = props;
  const { t } = useTranslation();
  // const { referrerURL, hmrcURL } = useHMRCExternalLinks();

  useEffect(() => {
    setPageTitle();
  }, []);

  return (
    <>
      <main className='govuk-main-wrapper' id='main-content' role='main'>
        {showPortalBanner && (
          <NotificationBanner content={t('PORTAL_NOTIFICATION_BANNER_CONTENT')} />
        )}
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-two-thirds'>
            <h1 className='govuk-heading-l'>{t('CHILD_BENEFIT_EXTENSION_REQUESTS')}</h1>
            <p className='govuk-body'>{t('VIEW_STATUS_OR_NOTIFY_CHANGES')}</p>
            <p className='govuk-body'>
              {t('YOUR_VIEW')}
              <a
                href='https://www.gov.uk/child-benefit-proof'
                target='_blank'
                className='govuk-link'
                rel='noopener noreferrer'
              >
                {t('PROOF_OF_ENTITLEMENT')}
              </a>
            </p>
          </div>
        </div>
        <hr
          className='govuk-section-break govuk-section-break--xl govuk-section-break--visible'
          aria-hidden
        ></hr>
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body'>
            <h2 className='govuk-heading-m'>{t('REQUESTS_IN_PROGRESS')}</h2>
            {children}
            <p className='govuk-body'>{t('WE_SAVED_YOUR_PROGRESS')}</p>
          </div>
        </div>
        <hr
          className='govuk-section-break govuk-section-break--xl govuk-section-break--visible'
          aria-hidden
        ></hr>
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body'>
            <h2 className='govuk-heading-m'>{t('SUBMITTED_REQUESTS')}</h2>
            {children}
            <p className='govuk-body'>
              <a
                href='https://www.gov.uk/child-benefit-proof'
                target='_blank'
                rel='noopener noreferrer'
                className='govuk-link'
              >
              {t('VIEW_DECISION_NOTICE')}
              </a>
            </p>
          </div>
        </div>
        <hr
          className='govuk-section-break govuk-section-break--xl govuk-section-break--visible'
          aria-hidden
        ></hr>
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-two-thirds'>
            <h2 className='govuk-heading-m'>{t('TELL_US_ABOUT_EDUCATION')}</h2>
            <p className='govuk-body'>{t('USE_THIS_SERVICE_TO_TELL_US')}
            <a
                href='https://www.gov.uk/child-benefit-proof'
                target='_blank'
                className='govuk-link'
                rel='noopener noreferrer'
              >
                {t('STARTING_NON_ADVANCED_EDUCATION')}
                </a>
            </p>
             <p className='govuk-body'>
             {t('MUST_TELL')}
              <a
                href='https://www.gov.uk/government/publications/child-benefit-child-left-approved-education-or-training-ch459'
                className='govuk-link'
                rel='noopener noreferrer'
              >
                {t('LEAVES_FULL_TIME_EDUCATION')}
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
