import React, { useContext, useEffect, useState } from 'react';
import GDSRadioButtons from '../../../BaseComponents/RadioButtons/RadioButtons';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';
import { checkStatus } from '../../../helpers/utils';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import GDSCheckAnswers from '../../../BaseComponents/CheckAnswer/index';
import { ReadOnlyDefaultFormContext } from '../../../helpers/HMRCAppContext';

export default function RadioButtons(props) {
  console.log("REACT: Fired RadioButtons.tsx")
const _fishCount = 0
console.log("React: RadioButtons.tsx Fired, Fish Count, ", _fishCount)
_fishCount +1;
  const {
    getPConnect,
    validatemessage,
    helperText,
    instructionText,
    readOnly,
    value,
    name,
    configAlternateDesignSystem,
    testId,
    fieldMetadata,
    placeholder
  } = props;
  const { hasBeenWrapped } = useContext(ReadOnlyDefaultFormContext);
  const [theSelectedButton, setSelectedButton] = useState(value);

  let label = props.label;

  const { isOnlyField, overrideLabel } = useIsOnlyField(props.displayOrder);
  if (isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const _browserLocal = sessionStorage.getItem('rsdk_locale')?.slice(0, 2) || 'en';
  console.log("REACT: locailised value is ", localizedVal, "and session storage is ", _browserLocal)

  const [errorMessage, setErrorMessage] = useState(localizedVal(validatemessage));
  useEffect(() => {
    setErrorMessage(localizedVal(validatemessage));
  }, [validatemessage]);

  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();
  const className = thePConn.getCaseInfo().getClassName();
  // theOptions will be an array of JSON objects that are literally key/value pairs.
  //  Ex: [ {key: "Basic", value: "Basic"} ]
  //const theOptions = Utils.getOptionList(theConfigProps, thePConn.getDataObject());
  const theOptions = Utils.getOptionList(theConfigProps, thePConn.getDataObject(''));
  const selectedOption = theOptions.find(option => option.key === value);

  let configProperty = thePConn.getRawMetadata()?.config?.value || '';
  configProperty = configProperty.startsWith('@P') ? configProperty.substring(3) : configProperty;
  configProperty = configProperty.startsWith('.') ? configProperty.substring(1) : configProperty;

  const metaData = Array.isArray(fieldMetadata)
    ? (fieldMetadata.filter(field => field?.classID === className)[0] || fieldMetadata.filter(field => field?.displayAs === 'pxRadioButtons')[0])
    : fieldMetadata;
  let displayName = metaData?.datasource?.propertyForDisplayText;
  displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
  const localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
  const localeClass = localeContext === 'datapage' ? '@baseclass' : className;
  const localeName = localeContext === 'datapage' ? metaData?.datasource?.name : configProperty;
  const localePath = localeContext === 'datapage' ? displayName : localeName;

 console.log("REACT: pcon label name",thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName))
 const _anchovy = thePConn.resolveConfigProps(props)
 console.log("REACT: _anchovy", _anchovy)
  let displayValue = null;
  if (selectedOption && selectedOption.value) {
    displayValue = selectedOption.value;
  }
  const inprogressStatus = checkStatus();
  const _koiCarplocalVals = thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName);
  const _roachlocalVals = thePConn.getLocalizedValue(
    displayValue,
    localePath,
    _koiCarplocalVals)
    console.log("REACT: _koiCarplocalVals ",_koiCarplocalVals)
    console.log("REACT: _roachVals",displayValue, props.label);
    const _sharkLocal = sessionStorage.getItem('rsdk_locale')?.slice(0, 2) || 'en';
    console.log("REACT: _sharkLocal value is ", localizedVal, "and session storage is ", _sharkLocal)
    console.log("REACT: _skimmerVals", thePConn.getLocalizedValue(props.label))

  if (
    hasBeenWrapped &&
    configAlternateDesignSystem?.ShowChangeLink &&
    inprogressStatus === 'Open-InProgress'
  ) {
    console.log("REACT: if has been wrapped fired!!")
    return (
      <GDSCheckAnswers
        label={props.label}
        value={thePConn.getLocalizedValue(
          displayValue,
          localePath,
          _koiCarplocalVals
          //thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
        )}
  
        name={name}
        stepId={configAlternateDesignSystem.stepId}
        hiddenText={configAlternateDesignSystem.hiddenText}
        getPConnect={getPConnect}
        required={false}
        disabled={false}
        validatemessage=''
        onChange={undefined}
        readOnly={false}
        testId=''
        helperText={helperText}
        placeholder={placeholder}
        hideLabel={false}
      />
    );
  }
  //log the value of language
  console.log("REACT: language is ", sessionStorage.getItem('rsdk_locale')?.slice(0, 2) || 'en' )
  //log the value of label, at the start of read only
  const _nemo = PCore.getLocaleUtils().getLocaleValue.toString;
  console.log("REACT: _nemo", _nemo);
  const localeReference = `${getPConnect().getCaseInfo().getClassName()}!CASE!${getPConnect()
    .getCaseInfo()
    .getName()}`.toUpperCase();
    console.log("REACT: Nemo LocalaleReference ",localeReference)
  const _trout = thePConn.getLocalizedValue(props.label,"fields",localeReference);
  console.log("REACT: _trout", _trout);
  if (readOnly) {
    console.log("REACT: if read only fired!!")
    return (
      <ReadOnlyDisplay
        label={label}
        value={thePConn.getLocalizedValue(
          displayValue,
          localePath,
          _koiCarplocalVals
         // thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
        )}
      />
    );
  }

  const extraProps = { testProps: { 'data-test-id': testId } };
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;
  
      //checking value fro connection
      const _shark = ""//actionsApi().getEnviromentInfo()
      console.log("_shark!! ", _shark)
      const _pike = thePConn.getLocalizedValue(props.label, localePath, thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName))
      console.log("_PIKE!! ", _pike)

  const handleChange = event => {
    handleEvent(actionsApi, 'changeNblur', propName, event.target.value);
  };
  
  const handleBlur = event => {
    thePConn.getValidationApi().validate(event.target.value, ''); // 2nd arg empty string until typedef marked correctly as optional
  };

  const forceFire = () => {
    useEffect(() => {       
        handleChange('changeNblur');
    }, [])
  };
  const _pearch = thePConn.getLocalizedValue(props.label);
  console.log("FINAL CALL OF PROPS.LABEL")
  console.log("REACT: _pearch", _pearch);
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
            _koiCarplocalVals
           // thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
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
