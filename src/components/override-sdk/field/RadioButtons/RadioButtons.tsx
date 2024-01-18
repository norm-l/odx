import React, { useContext, useEffect, useState } from 'react';
import GDSRadioButtons from '../../../BaseComponents/RadioButtons/RadioButtons';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import { UnAuthNINOContext } from '../../../helpers/HMRCAppContext';

export default function RadioButtons(props) {
  const {
    getPConnect,
    validatemessage,
    helperText,
    instructionText,
    readOnly,
    value,
    name,

    testId,
    fieldMetadata
  } = props;

  let label = props.label;
  const { isOnlyField, overrideLabel } = useIsOnlyField(props.displayOrder);
  if (isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;

  const [errorMessage, setErrorMessage] = useState(validatemessage);
  useEffect(() => {
    setErrorMessage(validatemessage);
  }, [validatemessage]);

  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();
  const className = thePConn.getCaseInfo().getClassName();
  // theOptions will be an array of JSON objects that are literally key/value pairs.
  //  Ex: [ {key: "Basic", value: "Basic"} ]
  const theOptions = Utils.getOptionList(theConfigProps, thePConn.getDataObject());
  const selectedOption = theOptions.find(option => option.key === value);

  let configProperty = thePConn.getRawMetadata()?.config?.value || '';
  configProperty = configProperty.startsWith('@P') ? configProperty.substring(3) : configProperty;
  configProperty = configProperty.startsWith('.') ? configProperty.substring(1) : configProperty;

  const metaData = Array.isArray(fieldMetadata)
    ? fieldMetadata.filter(field => field?.classID === className)[0]
    : fieldMetadata;
  let displayName = metaData?.datasource?.propertyForDisplayText;
  displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
  const localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
  const localeClass = localeContext === 'datapage' ? '@baseclass' : className;
  const localeName = localeContext === 'datapage' ? metaData?.datasource?.name : configProperty;
  const localePath = localeContext === 'datapage' ? displayName : localeName;

  let displayValue = null;
  if (selectedOption && selectedOption.value) {
    displayValue = selectedOption.value;
  }

  if (readOnly) {
    return (
      <ReadOnlyDisplay
        label={label}
        value={thePConn.getLocalizedValue(
          displayValue,
          localePath,
          thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
        )}
      />
    );
  }

  const extraProps = { testProps: { 'data-test-id': testId } };
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;
  let { haveNINO, setHaveNINO } = useContext(UnAuthNINOContext);
  const handleChange = event => {
    if (event.target.id === 'Claimant-IsNINOKnown') {
      if (event.target.value === 'Yes') {
        setHaveNINO(true);
      }
    }
    handleEvent(actionsApi, 'changeNblur', propName, event.target.value);
  };

  return (
    <GDSRadioButtons
      {...props}
      name={name}
      label={label}
      onChange={handleChange}
      legendIsHeading={isOnlyField}
      options={theOptions.map(option => {
        return {
          value: option.key,
          label: thePConn.getLocalizedValue(
            option.value,
            localePath,
            thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
          )
        };
      })}
      displayInline={theOptions.length === 2}
      hintText={helperText}
      instructionText={instructionText}
      errorText={errorMessage}
      {...extraProps}
    />
  );
}
