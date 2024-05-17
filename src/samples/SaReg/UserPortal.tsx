import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import NotificationBanner from '../../components/BaseComponents/NotificationBanner/NotificationBanner';

export default function UserPortal(props) {
  const { children, showPortalBanner } = props;
  const { t } = useTranslation();

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
            <h1 className='govuk-heading-l'>{t('YOUR_REGISTRATION')}</h1>
          </div>
        </div>
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body'>

            {/* SA Registration */}
            <div className='govuk-grid-column-two-thirds'>
              <>{children}</>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
