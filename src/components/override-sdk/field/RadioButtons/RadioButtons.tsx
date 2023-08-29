import React, { useEffect, useState } from 'react';
import GDSRadioButtons from '../../../BaseComponents/RadioButtons/RadioButtons';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks'
import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';



export default function RadioButtons(props) {
  const {
    getPConnect,
    label,
    validatemessage,
    helperText,
    instructionText,
    readOnly,
    value,
    name,
    testId
  } = props;

  const[errorMessage,setErrorMessage] = useState(validatemessage);

  useEffect(()=>{
    if(validatemessage){
    setErrorMessage(validatemessage)
    }

  },[validatemessage])


  const thePConn = getPConnect();
  const hidePageLabel = useIsOnlyField(thePConn);
  const theConfigProps = thePConn.getConfigProps();
  // theOptions will be an array of JSON objects that are literally key/value pairs.
  //  Ex: [ {key: "Basic", value: "Basic"} ]
  const theOptions = Utils.getOptionList(theConfigProps, thePConn.getDataObject());
  const selectedOption = theOptions.find(option => option.key === value);

  let displayValue = null;
  if(selectedOption && selectedOption.value){
    displayValue = selectedOption.value;
  }

  if(readOnly){
    return <ReadOnlyDisplay label={label} value={displayValue} />
  }

  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;

  const handleChange = event => {
    handleEvent(actionsApi, 'changeNblur', propName, event.target.value);
  };

  const extraProps= {testProps:{'data-test-id':testId}};

  return (
    <GDSRadioButtons
      {...props}
      name={name}
      label={label}
      onChange={handleChange}
      legendIsHeading={hidePageLabel}
      options={theOptions.map(option => {return {value:option.key, label:option.value}})}
      displayInline={theOptions.length === 2}
      hintText={helperText}
      instructionText={instructionText}
      errorText={errorMessage}
      {...extraProps}
    />
  );
}
