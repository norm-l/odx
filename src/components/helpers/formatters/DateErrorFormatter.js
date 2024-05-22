import i18n from 'i18next';

const _DateErrorFormatter = message => {
  const dateRegExp = /(\d*-\d*-\d*)/;
  const matchedDates = message.match(dateRegExp);
  const originalDate = matchedDates?.length > 0 ? matchedDates[0] : null;
  const targets = [];

  if (originalDate) {
    const [year, month, day] = originalDate.split('-');

    // When some 'parts' are missing
    let missingPartMessage = '';
    if (day === '') {
      missingPartMessage += '_A_DAY';
      targets.push('day');
    }
    if (month === '') {
      if (missingPartMessage.length > 0) missingPartMessage += '_AND_A_MONTH';
      else missingPartMessage += '_A_MONTH';
      targets.push('month');
    }
    if (year === '') {
      if (missingPartMessage.length > 0) missingPartMessage += '_AND_A_YEAR';
      else missingPartMessage += '_A_YEAR';
      targets.push('year');
    }
    const shortPropertyName = 'DATE';

    if (missingPartMessage.length > 0) {
      return {
        message: i18n.t(`${shortPropertyName}_MUST_INCLUDE${missingPartMessage}`),
        targets
      };
    }

    if (message.search(i18n.t('IS_NOT_A_VALID_DATE'))) {
      return { message: i18n.t(`${shortPropertyName}_MUST_BE_A_REAL_DATE`), targets };
    }
  }
  return { message, targets };
};

export const DateErrorFormatter = (message, propertyName) => {
  if (propertyName === ' ') propertyName = i18n.t('DATE_OF_BIRTH');
  return _DateErrorFormatter(message).message;
};

export const DateErrorTargetFields = message => {
  return _DateErrorFormatter(message).targets;
};
