import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import NotificationBanner from '../../components/BaseComponents/NotificationBanner/NotificationBanner';

export default function UserPortal(props) {
  const { children, showPortalBanner, isLogout } = props;
  const { t } = useTranslation();

  useEffect(() => {
    setPageTitle();
  }, []);

  return (
    <>
      <main
        className={isLogout ? 'govuk-main-wrapper visibility-hidden' : 'govuk-main-wrapper'}
        id='main-content'
        role='main'
      >
        {showPortalBanner && (
          <NotificationBanner content={t('PORTAL_NOTIFICATION_BANNER_CONTENT')} />
        )}
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body govuk-!-padding-right-0 govuk-!-padding-left-0'>
            {/* SA Registration */}
            <div className='govuk-grid-column-two-thirds'>
              <>{children}</>
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
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
