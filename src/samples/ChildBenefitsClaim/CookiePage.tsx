import React from 'react';
import { useTranslation } from 'react-i18next';

import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import LanguageToggle from '../../components/AppComponents/LanguageToggle';

export default function CookiePage() {
  const { t } = useTranslation();

  return (
    <>
      <AppHeader appname={t("CLAIM_CHILD_BENEFIT")} />
      <div className="govuk-width-container">
        <LanguageToggle />
        <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
          <div className="govuk-grid-row">
            <div className='govuk-grid-column-two-thirds'>
              <h1 className=''> {t('COOKIES')}</h1>
            </div>
          </div>
        </main>
      </div>
      <AppFooter/>
    </>
  );
};
