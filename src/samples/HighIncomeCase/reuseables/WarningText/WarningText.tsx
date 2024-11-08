import React from 'react';
import { useTranslation } from 'react-i18next';

export default function WarningText(props) {
  const { children } = props;
  const { t } = useTranslation();

  return (
    <div className='govuk-warning-text'>
      <span className='govuk-warning-text__icon' aria-hidden='true'>
        !
      </span>
      <strong className='govuk-warning-text__text'>
        <span className='govuk-visually-hidden'>{t('WARNING')}</span>
        {children}
      </strong>
    </div>
  );
}