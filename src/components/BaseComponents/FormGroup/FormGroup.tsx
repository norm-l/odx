import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ConditionalWrapper from '../../helpers/formatters/ConditionalWrapper';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';
import { DefaultFormContext, ErrorMsgContext } from '../../helpers/HMRCAppContext';
import { checkErrorMsgs, removeRedundantString } from '../../helpers/utils';
import InstructionTextComponent from '../../override-sdk/template/DefaultForm/InstructionTextComponent';

function makeHintId(identifier) {
  return `${identifier}-hint`;
}
function makeErrorId(identifier) {
  return `${identifier}-error`;
}
function makeItemId(index, identifier) {
  return `${identifier}${index > 0 ? `-${index}` : ''}`;
}

export default function FormGroup({
  labelIsHeading = false,
  label,
  errorText,
  hintText,
  name,
  id,
  extraLabelClasses = '',
  children,
  testProps = {}
}) {
  const { instructionText } = useContext(DefaultFormContext);
  const { errorMsgs } = useContext(ErrorMsgContext);
  const [errMessage, setErrorMessage] = useState(errorText);
  useEffect(() => {
    const found = checkErrorMsgs(errorMsgs, id, name);
    if (!found) {
      setErrorMessage(errorText);
    }
  }, [errorText, errorMsgs]);

  const formGroupDivClasses = `govuk-form-group ${
    errMessage ? 'govuk-form-group--error' : ''
  }`.trim();
  const labelClasses = `govuk-label ${
    labelIsHeading ? 'govuk-label--l' : ''
  } ${extraLabelClasses}`.trim();

  return (
    <div className={formGroupDivClasses} {...testProps}>
      <ConditionalWrapper
        condition={labelIsHeading}
        wrapper={child => {
          return <h1 className='govuk-label-wrapper govuk-heading-l'>{child}</h1>;
        }}
        childrenToWrap={
          <label className={labelClasses} htmlFor={id || name}>
            {label}
          </label>
        }
      />
      {instructionText && labelIsHeading && (
        <InstructionTextComponent instructionText={instructionText} />
      )}
      {hintText && (
        <div id={makeHintId(name)} className='govuk-hint'>
          <HintTextComponent htmlString={hintText} />
        </div>
      )}
      {errMessage && (
        <p id={makeErrorId(name)} className='govuk-error-message'>
          <span className='govuk-visually-hidden'>Error:</span>
          {removeRedundantString(errMessage)}
        </p>
      )}
      {children}
    </div>
  );
}

FormGroup.propTypes = {
  label: PropTypes.string,
  labelIsHeading: PropTypes.bool,
  hintText: PropTypes.string,
  errorText: PropTypes.string,
  children: PropTypes.node,
  extraLabelClasses: PropTypes.string,
  id: PropTypes.string
};

export { makeErrorId, makeHintId, makeItemId };
