import React from 'react';
import Button from '../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';

export default function UserPortal(props) {
  const { beginClaim, children } = props;
  const { t } = useTranslation();

  return (
    <>
      <main className="govuk-main-wrapper" id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className='govuk-grid-column-two-thirds'>
            <h1 className='govuk-heading-xl'>{t('YOUR_CLAIM_APPLICATIONS')}</h1>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body'>
            <p className='govuk-body'>This page shows two groups of claims:</p>
            <ul className='govuk-list govuk-list--bullet'>
              <li><span className='govuk-body'>claims that are in progress</span></li>
              <li><span className='govuk-body'>claims that have already been submitted</span></li>
            </ul>
            <hr className="govuk-section-break govuk-section-break--xl govuk-section-break--visible"></hr>

            {/* Claims list */}
            <div className='govuk-grid-column-two-thirds'>
              <>{children}</>
              <>
                <p className='govuk-heading-m'>Make a claim</p>
                <p className='govuk-body'>Use this service to make a new claim for Child Benefit.</p>
                <Button
                  attributes={{ className: 'govuk' }}
                  onClick={beginClaim}
                  variant='start'
                >
                  {t('BEGIN_NEW_CLAIM')}
                </Button>
                <h3 className="govuk-heading-m" id="subsection-title">{t('ONLINE')}</h3>
                <p><a
                  href='https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit'
                  className='govuk-link'
                  rel='noreferrer noopener'
                  target='_blank'
                >
                  {t('ASK_HMRC_ONLINE')} {t('OPENS_IN_NEW_TAB')}
                </a></p>
                <p className='govuk-body'>Ask HMRC’s digital assistant to find information about:</p>
                <ul className="govuk-list govuk-list--bullet">
                  <li><span className='govuk-body'>claiming Child Benefit</span></li>
                  <li><span className='govuk-body'>the High Income Child Benefit Tax Charge</span></li>
                  <li><span className='govuk-body'>any change of circumstances for you or your child which may affect your claim</span></li>
                </ul>
              </>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
