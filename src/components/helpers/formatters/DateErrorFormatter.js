import i18n from 'i18next';

const _DateErrorFormatter = message => {
  const dateRegExp = /\b(\d{4})-(\d{2})-(\d{2})\b/;
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

    // Check if the extracted date is a valid date
    const date = new Date(`${year}-${month}-${day}`);
    if (
      isNaN(date.getTime()) ||
      date.getFullYear() !== parseInt(year) ||
      date.getMonth() + 1 !== parseInt(month) ||
      date.getDate() !== parseInt(day)
    ) {
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

// Test cases REMOVE BEFORE PR

const testCases = [
  '2023-06-01',
  '1999-12-31',
  '2000-01-01',
  '2024-02-29',
  '0000-01-01',
  '202-06-01',
  '20233-06-01',
  '2023-6-01',
  '2023-06-1',
  '2023-13-01',
  '2023-00-01',
  '2023-06-32',
  '2023-06-00',
  '23-06-01',
  '2023-6-1',
  '20a3-06-01',
  '2023-0b-01',
  '2023-06-0c',
  '2023-06-01extra',
  'extra2023-06-01',
  '2023-06-01 2023-07-01',
  'date: 2023-06-01, another date: 2023-07-01',
  'This is a random string',
  '',
  '12345'
];

const dateRegExp = /\b(\d{4})-(\d{2})-(\d{2})\b/;

testCases.forEach(test => {
  const match = test.match(dateRegExp);
  console.log(`Test: "${test}" => Match: ${match ? match[0] : 'No match'}`);
});
