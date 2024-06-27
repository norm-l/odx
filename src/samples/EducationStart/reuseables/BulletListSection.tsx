import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function BulletListSection({ titleKey, bulletPoints }) {
  const { t } = useTranslation();

  return (
    <>
      <p className='govuk-body'>{t(titleKey)}</p>
      <ul className='govuk-list govuk-list--bullet'>
        {bulletPoints.map(point => (
          // Using the bullet point text as the key
          <li key={point}>{t(point)}</li>
        ))}
      </ul>
    </>
  );
}

BulletListSection.propTypes = {
  titleKey: PropTypes.string.isRequired,
  bulletPoints: PropTypes.arrayOf(PropTypes.string).isRequired
};
