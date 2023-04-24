
const _DateErrorFormatter = (message, propertyName) => {

  const dateRegExp = /(\d*-\d*-\d*)/;
  const originalDate = message.match(dateRegExp)[0];
  let correctedDate;
  let targets = []

  let newMessage = message;

  if(originalDate){
     const [year, month, day] = originalDate.split('-');
     correctedDate = `${day}/${month}/${year}`;

    // When some 'parts' are missing
    let missingPartMessage = ''
    if(day === ''){
      missingPartMessage += 'a day';
      targets.push('day');
    }
    if(month === ''){
      missingPartMessage.length > 0 ? missingPartMessage+=' and a month' : missingPartMessage+='a month';
      targets.push('month');
    }
    if(year === ''){
      missingPartMessage.length > 0 ? missingPartMessage+=' and a year' : missingPartMessage+='a year';
      targets.push('year');
    }
    if(missingPartMessage.length > 0){
      return {message: `${propertyName} must include ${missingPartMessage}`, targets:targets};
    }

    if(message.find('is not a valid date')){
      return {message: `${propertyName} must include ${missingPartMessage}` `${propertyName} must be a real date`, targets};
    }

  }
  return {message:message, targets:targets};
}

export const DateErrorFormatter = (message, propertyName) => {
  return _DateErrorFormatter(message, propertyName).message;
}

export const DateErrorTargetFields = (message) => {
  return _DateErrorFormatter(message, null).targets;
}
