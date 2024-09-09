import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function ErrorSummary(props) {
  const { errors } = props;
  const { t } = useTranslation();

  const errorSummaryRef = useRef<any>(null);

  useEffect(() => {
    if (errorSummaryRef && errorSummaryRef?.current) {
      errorSummaryRef.current.focus();
    }
  }, [errorSummaryRef]);

  function onClick(e) {
    const ref = e.target.href.indexOf('#') && e.target.href.split('#').pop();
    const target: any = document.getElementById(ref);
    if (!target) return !1;
    target.focus();
    e.preventDefault();
  }

  return (
    <div
      ref={errorSummaryRef}
      className='govuk-error-summary'
      data-module='govuk-error-summary'
      tabIndex={-1}
    >
      <div role='alert'>
        <h2 className='govuk-error-summary__title'>{t('THERE_IS_A_PROBLEM')}</h2>
        <div className='govuk-error-summary__body'>
          <ul className='govuk-list govuk-error-summary__list'>
            {errors.map(error => {
              return (
                <li key={error.fieldId}>
                  <a href={`#${error.fieldId}`} onClick={onClick}>
                    {error.message}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

ErrorSummary.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({ fieldId: PropTypes.string, message: PropTypes.string })
  )
};
