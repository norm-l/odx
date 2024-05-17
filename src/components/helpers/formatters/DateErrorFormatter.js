import i18n from 'i18next';

const _DateErrorFormatter = (message, propertyName = '') => {
  const dateRegExp = /(\d*-\d*-\d*)/;
  const matchedDates = message.match(dateRegExp);
  const originalDate = matchedDates?.length > 0 ? matchedDates[0] : null;
  const targets = [];
  const dateFieldsAndCustomErrorMsg = [
    {'when did you become self-employed?': 'THE_DATE_YOU_BECAME_SELF_EMPLOYED'},
    {'when did you first get income from land and property in the uk?': 'THE_DATE_YOU_RECEIVE_INCOME_FROM_LAND_PROPERTY'},
    {'when did you first get foreign income?': 'THE_DATE_YOU_RECEIVE_FOREIGN_INCOME'},
    {'when did you first get income from savings, investments or dividends?': 'THE_DATE_YOU_RECEIVE_SAVINGS_INVESTMENTS_DIVIDENDS'},
    {'when did you become liable for hicbc?': 'THE_DATE_YOU_BECAME_LIABLE_FOR_HICBC'},
    {'when did you first get income that you have to pay capital gains tax on?': 'THE_DATE_YOU_RECEIVE_INCOME_TO_PAY_CAPITAL_GAIN_TAX'},
    {'when did you first get any other untaxed income?': 'THE_DATE_YOU_RECEIVE_OTHER_UNTAXED_INCOME'},
  ]; // the key should be in lower case

  if (originalDate) {
    const [year, month, day] = originalDate.split('-');

    // When some 'parts' are missing
    let missingPartMessage = '';
    if (day === '') {
      missingPartMessage += ` ${i18n.t('A_DAY')}`;
      targets.push('day');
    }
    if (month === '') {
      if (missingPartMessage.length > 0) missingPartMessage += i18n.t('AND_A_MONTH');
      else missingPartMessage += i18n.t('A_MONTH');
      targets.push('month');
    }
    if (year === '') {
      if (missingPartMessage.length > 0) missingPartMessage += ` ${i18n.t('AND_A_YEAR')}`;
      else missingPartMessage += ` ${i18n.t('A_YEAR')}`;
      targets.push('year');
    }
    const shortPropertyName = i18n.t('DATE');
    const dateAndcustomErrorMsg = dateFieldsAndCustomErrorMsg.filter(item => Object.keys(item).indexOf(propertyName.toLowerCase()) > -1)[0];
    if (missingPartMessage.length > 0) {
      if (dateAndcustomErrorMsg) {
        return {
          message: `${i18n.t(Object.values(dateAndcustomErrorMsg))} ${i18n.t('MUST_INCLUDE')} ${missingPartMessage}`,
          targets
        }
      } else { 
        return {
          message: `${shortPropertyName} ${i18n.t('MUST_INCLUDE')} ${missingPartMessage}`,
          targets
        };
      }
    }

    if (message.search(i18n.t('IS_NOT_A_VALID_DATE'))) {
      if (dateAndcustomErrorMsg) {
        return { message: `${i18n.t(Object.values(dateAndcustomErrorMsg))} ${i18n.t('MUST_BE_A_REAL_DATE')} `, targets };
      } else {
        return { message: `${shortPropertyName} ${i18n.t('MUST_BE_A_REAL_DATE')} `, targets };
      }
    }
  }
  return { message, targets };
};

export const DateErrorFormatter = (message, propertyName) => {
  if (propertyName === ' ') propertyName = i18n.t('DATE_OF_BIRTH');
  return _DateErrorFormatter(message, propertyName).message;
};

export const DateErrorTargetFields = message => {
  return _DateErrorFormatter(message).targets;
};
