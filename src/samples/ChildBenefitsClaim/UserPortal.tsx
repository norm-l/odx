import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import NotificationBanner from '../../components/BaseComponents/NotificationBanner/NotificationBanner';
import ExistingInprogressClaimsContent from './ExistingInprogressClaimsContent';
import ExistingSubmittedClaimsContent from './ExistingSubmittedClaimsContent';
import NewClaimContent from './NewClaimContent';

export default function UserPortal(props) {
  const {
    beginClaim,
    children,
    showPortalBanner,
    beginNewClaimButtonForSubmittedClaims,
    beginNewClaimButtonForInProgressClaims
  } = props;
  const { t } = useTranslation();
  const { referrerURL, hmrcURL } = useHMRCExternalLinks();

  useEffect(() => {
    setPageTitle();
    sessionStorage.setItem('isTasklistScreen', 'false');
  }, []);

  function hideShowBeginNewClaim() {
    if (beginNewClaimButtonForSubmittedClaims && beginNewClaimButtonForInProgressClaims) {
      return (
        <>
          <ExistingSubmittedClaimsContent />

          <ExistingInprogressClaimsContent />
        </>
      );
    } else if (beginNewClaimButtonForSubmittedClaims) {
      return <ExistingSubmittedClaimsContent />;
    } else if (beginNewClaimButtonForInProgressClaims) {
      return <ExistingInprogressClaimsContent />;
    } else {
      return <NewClaimContent beginClaim={beginClaim} />;
    }
  }
  return (
    <>
      <main className='govuk-main-wrapper' id='main-content' role='main'>
        {showPortalBanner && (
          <NotificationBanner content={t('PORTAL_NOTIFICATION_BANNER_CONTENT')} />
        )}
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-two-thirds'>
            <h1 className='govuk-heading-l'>{t('YOUR_CLAIM_APPLICATIONS')}</h1>
          </div>
        </div>
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body'>
            <p className='govuk-body'>{t('THIS_PAGE_SHOWS')}</p>
            <ul className='govuk-list govuk-list--bullet'>
              <li>
                <span className='govuk-body'>{t('CLAIMS_THAT_ARE_IN_PROGRESS')}</span>
              </li>
              <li>
                <span className='govuk-body'>{t('CLAIMS_THAT_ARE_SUBMITTED')}</span>
              </li>
            </ul>
            <hr
              className='govuk-section-break govuk-section-break--xl govuk-section-break--visible'
              aria-hidden
            ></hr>

            {/* Claims list */}
            <div className='govuk-grid-column-two-thirds'>
              <>{children}</>
              <>
                <h2 className='govuk-heading-m' id='subsection-title'>
                  {t('MAKE_A_CLAIM')}
                </h2>

                {hideShowBeginNewClaim()}
              </>
              <>
                <h2 className='govuk-heading-m' id='subsection-title'>
                  {t('GET_HELP_ONLINE')}
                </h2>
                <p className='govuk-body'>
                  <a
                    href='https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit'
                    className='govuk-link'
                    rel='noreferrer noopener'
                    target='_blank'
                  >
                    {t('ASK_HMRC_ONLINE')} {t('OPENS_IN_NEW_TAB')}
                  </a>
                </p>
                <p className='govuk-body'>{t('ASK_HMRC_DIGITAL')}</p>
                <ul className='govuk-list govuk-list--bullet'>
                  <li>
                    <span className='govuk-body'>{t('CLAIMING_CHILD_BENEFIT')}</span>
                  </li>
                  <li>
                    <span className='govuk-body'>{t('THE_HIGH_INCOME_CHB_TAX_CHARGE')}</span>
                  </li>
                  <li>
                    <span className='govuk-body'>{t('ANY_CHANGE_OF_CIRCUMSTANCE')}</span>
                  </li>
                </ul>
                <br />
                <a
                  lang='en'
                  className='govuk-link hmrc-report-technical-issue '
                  rel='noreferrer noopener'
                  target='_blank'
                  href={`${hmrcURL}contact/report-technical-problem?newTab=true&service=463&referrerUrl=${referrerURL}`}
                >
                  {t('PAGE_NOT_WORKING_PROPERLY')} {t('OPENS_IN_NEW_TAB')}
                </a>
              </>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
