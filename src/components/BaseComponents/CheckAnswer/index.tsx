import React, { useEffect, useState } from 'react';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import { useTranslation } from 'react-i18next';

interface HmrcOdxTestProps extends PConnFieldProps {
  // If any, enter additional props that only exist on this componentName
  name?: string;
  stepId?: any;
}

// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function GDSCheckAnswers(props: HmrcOdxTestProps) {
  const COMMA_DELIMITED_FIELD = 'CSV';
  const { label, value, name, stepId, getPConnect } = props;
  const [formattedValue, setFormattedValue] = useState<string | Array<string>>(value);
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const containerItemID = pConn.getContextName();
  const { t } = useTranslation();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    if (name && name.indexOf(COMMA_DELIMITED_FIELD) !== -1 && value.indexOf(',') !== -1) {
      const formatValue = value.split(',').map((item: string) => item.trim());
      setFormattedValue(formatValue);
    }
  }, []);
  const handleOnClick = () => {
    const navigateToStepPromise = actions.navigateToStep(stepId, containerItemID);

    navigateToStepPromise
      .then(() => {
        //  navigate to step success handling
        console.log('navigation successful'); // eslint-disable-line
      })
      .catch(error => {
        // navigate to step failure handling
        // eslint-disable-next-line no-console
        console.log('Change link Navigation failed', error);
      });
  };

  return (
    <div className='govuk-summary-list__row'>
      <dt className='govuk-summary-list__key'>{label}</dt>

      <dd className='govuk-summary-list__value'>
        {Array.isArray(formattedValue) ? (
          <ul className='govuk-list'>
            {formattedValue.map(valueItem => (
              <li key={valueItem}>{valueItem}</li>
            ))}
          </ul>
        ) : (
          formattedValue || value
        )}{' '}
      </dd>
      <dd className='govuk-summary-list__actions'>
        <a href='#' className='govuk-link' onClick={handleOnClick} data-step-id={stepId}>
          {t('GDS_ACTION_CHANGE')}
          <span className='govuk-visually-hidden'> {label}</span>
        </a>
      </dd>
    </div>
  );
}
