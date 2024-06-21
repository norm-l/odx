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
          <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body govuk-!-padding-right-0 govuk-!-padding-left-0'>
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
