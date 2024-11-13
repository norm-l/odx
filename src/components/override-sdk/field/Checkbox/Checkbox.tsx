import React, { useContext, useEffect, useState } from 'react';
import GDSCheckbox from '../../../BaseComponents/Checkboxes/Checkbox';
// import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks'
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import { DefaultFormContext, ErrorMsgContext } from '../../../helpers/HMRCAppContext';
import { checkErrorMsgs, checkStatus, removeRedundantString } from '../../../helpers/utils';
import { t } from 'i18next';
import GDSCheckAnswers from '../../../BaseComponents/CheckAnswer/index';
import { ReadOnlyDefaultFormContext } from '../../../helpers/HMRCAppContext';

export default function CheckboxComponent(props) {
  const { OverrideLabelValue } = useContext(DefaultFormContext);

  const {
    getPConnect,
    inputProps,
    validatemessage,
    hintText,
    readOnly,
    value,
    configAlternateDesignSystem,
    helperText,
    placeholder
  } = props;

  // let label = props.label;

  // These two properties should be passed to individual checkbox components via pconnet registerAdditionalProps
  // exclusiveOption should be boolean indicating if this checkbox is and exclusive option, and will render the 'or'
  // div above it if it is.
  // exclusiveOptionChangeHandler will always be called in the onChange event, and so each checkbox should be passed a
  // relevant handler (mainly - non-exclusive checkboxes should have a handler that clears the exclusive option ,
  // and exclusive option will need a different handler to clear all other items )
  const {
    exclusiveOption,
    exclusiveOptionChangeHandler = () => {},
    index
  } = getPConnect().getConfigProps();
  // const {isOnlyField, overrideLabel} = useIsOnlyField(props.displayOrder);
  /* retaining for future reference, incase changes need to be reverted
 
  if(isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label; */
  const { hasBeenWrapped } = useContext(ReadOnlyDefaultFormContext);

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const [errorMessage, setErrorMessage] = useState(localizedVal(validatemessage));
  const { errorMsgs } = useContext(ErrorMsgContext);

  // build name for id, allows for error message navigation to field
  const propertyContext = getPConnect().options.pageReference
    ? getPConnect().options.pageReference.split('.').pop()
    : '';
  const propertyName = getPConnect().getStateProps().value.split('.').pop();
  const name = `${propertyContext}-${propertyName}`;

  useEffect(() => {
    const found = checkErrorMsgs(errorMsgs, name);
    if (!found) {
      setErrorMessage(localizedVal(validatemessage));
    }
  }, [errorMsgs, validatemessage]);

  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();
  const { caption } = theConfigProps;
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;
  const inprogressStatus = checkStatus();

  if (
    hasBeenWrapped &&
    configAlternateDesignSystem?.ShowChangeLink &&
    inprogressStatus === 'Open-InProgress'
  ) {
    return (
      <GDSCheckAnswers
        label={props.label}
        value={value ? props.trueLabel : props.falseLabel}
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

  if (readOnly) {
    return <ReadOnlyDisplay value={value ? props.trueLabel : props.falseLabel} label={caption} />;
  }

  const handleChange = event => {
    handleEvent(actionsApi, 'changeNblur', propName, event.target.checked);
  };

  return (
    <>
      {exclusiveOption && (
        <div className='govuk-checkboxes__divider'>{t('EXCLUSIVEOPTION_OR')}</div>
      )}

      {/* If its the declaration view then group the checkboxes separately so the error message is assigned correctly */}
      {OverrideLabelValue.trim().toLowerCase() === 'declaration' ||
      OverrideLabelValue.trim().toLowerCase() === 'datganiad' ? (
        <div className={`govuk-form-group ${errorMessage ? 'govuk-form-group--error' : ''}`}>
          {errorMessage && (
            <p id={`${name}-error`} className='govuk-error-message'>
              <span className='govuk-visually-hidden'>{t('ERROR')}:</span>{' '}
              {removeRedundantString(errorMessage)}
            </p>
          )}
          <GDSCheckbox
            item={{ checked: value, label: caption, readOnly: false, hintText }}
            index={index}
            name={name}
            inputProps={{ ...inputProps }}
            onChange={evt => {
              handleChange(evt);
              exclusiveOptionChangeHandler();
            }}
            key={name}
          />
        </div>
      ) : (
        <GDSCheckbox
          item={{ checked: value, label: caption, readOnly: false, hintText }}
          index={index}
          name={name}
          inputProps={{ ...inputProps }}
          onChange={evt => {
            handleChange(evt);
            exclusiveOptionChangeHandler();
          }}
          key={name}
        />
      )}
    </>
  );
}
