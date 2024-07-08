import i18n from 'i18next';
import { isEduStartJourney, getWorkareaContainerName } from './../utils';

const _DateErrorFormatter = (message, propertyName) => {
  // Function to check if the user has entered hyphens into the input
  const hasMoreThanThreeHyphens = msg => msg.split('-').length > 3;
  const dateRegExp = /(\d*-\d*-\d*)/;
  const matchedDates = message.match(dateRegExp);
  const originalDate = matchedDates?.length > 0 ? matchedDates[0] : null;
  const targets = [];
  const isDateOfBirth = propertyName?.toLowerCase().includes('date of birth');
  let invalidDateErrorMsgByField = '';

  if (originalDate && !hasMoreThanThreeHyphens(message)) {
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
    let missingPartErrorMessage = i18n.t(`DATE_MUST_INCLUDE${missingPartMessage}`);
    // const shortPropertyName = propertyName;
    if(isEduStartJourney()){
      console.log('EOOE', PCore.getStore().getState());
      // shortPropertyName = checkAssignmentsSetPropertyName(propertyName) || shortPropertyName;
      if(isMultipleDateInput()) {
        missingPartErrorMessage = propertyName + ' ' +i18n.t(`MUST_INCLUDE${missingPartMessage}`);
        // missingPartErrorMessage = propertyName + ' ' +i18n.t(`MUST_INCLUDE${missingPartMessage}`);
        invalidDateErrorMsgByField = propertyName + ` ${i18n.t('MUST_BE_A_REAL_DATE')}`;
        // shortPropertyName = propertyName.replace(' ', '_')?.toUpperCase();
        // let propertyNameLabel = 'LABEL_FOR_';
        // propertyNameLabel += (propertyName?.split(' ')?.length >= 5) ?  propertyName?.split(' ').slice(0,5).join('_').toUpperCase() : propertyName?.replace(' ', '_')?.toUpperCase();
        // console.log('PP:', propertyNameLabel);
      }
    }

    if (missingPartMessage.length > 0) {
        return {
          message: missingPartErrorMessage,
          targets
        };
    }

    if (message.search(i18n.t('IS_NOT_A_VALID_DATE'))) {
      let invalidDateErrorMsg = invalidDateErrorMsgByField ? invalidDateErrorMsgByField : i18n.t(`DATE_MUST_BE_A_REAL_DATE`);
      return {
        message: isDateOfBirth
          ? `${i18n.t('DATE_OF_BIRTH')} ${i18n.t('MUST_BE_A_REAL_DATE')}`
          : invalidDateErrorMsg,
        targets
      };
    }
  } else if (hasMoreThanThreeHyphens(message)) {
    return {
      message: isDateOfBirth
        ? `${i18n.t('DATE_OF_BIRTH')} ${i18n.t('MUST_BE_A_REAL_DATE')}`
        : i18n.t('DATE_MUST_BE_A_REAL_DATE'),
      targets
    };
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

// const checkAssignmentsSetPropertyName = (propertyName) => {
  // const assignmentsPagesforCustomMsg = ['CourseDurationDetails'];
  // const containername = PCore.getContainerUtils().getActiveContainerItemName(
  //   `${PCore.getConstants().APP.APP}/primary`
  // );
  // const currentPageAssignmentsID = PCore.getStore().getState().data[containername]?.caseInfo?.assignments[0]?.processID;
  // if(assignmentsPagesforCustomMsg.indexOf(currentPageAssignmentsID) > -1) {
  //   return propertyName?.replace(' ', '_').toUpperCase();
  // }
// }

const isMultipleDateInput = (propertyName) => {
  // const assignmentsPagesforCustomMsg = ['CourseDurationDetails'];
  const containerName = getWorkareaContainerName();
  const formEditablefields = PCore.getFormUtils().getEditableFields(containerName);
  if(formEditablefields?.length > 1) {
    return formEditablefields.filter(field => field.type.toLowerCase() === 'date').length > 1 ? true : false;;
    // return dateField?.length > 1 ? true : false; 
  }
  return false;
}