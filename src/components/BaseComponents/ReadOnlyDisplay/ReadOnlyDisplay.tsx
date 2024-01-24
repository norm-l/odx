import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ReadOnlyDisplay(props) {
  const COMMA_DELIMITED_FIELD = 'Claimant-pyCommaDelimitedString';
  const { label, value, name } = props;
  const [formattedValue, setFormattedValue] = useState<string | []>(value);

  useEffect(() => {
    if (name === COMMA_DELIMITED_FIELD) {
      const formatValue = value.split(',').map((item: string) => item.trim());
      setFormattedValue(formatValue);
    }
  }, []);

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
          formattedValue
        )}{' '}
      </dd>
    </div>
  );
}

ReadOnlyDisplay.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  name: PropTypes.string
};
