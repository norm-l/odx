import React from 'react';
import PropTypes from 'prop-types';

export default function FieldSet({legendIsHeading=true, label, name, errorText, hintText, instructionText, children, fieldsetElementProps, testProps}){

  const formGroupDivClasses = `govuk-form-group ${errorText?'govuk-form-group--error':""}`.trim();
  const legendClasses = `govuk-fieldset__legend`;

  // TODO Reconsider how to generate hintID and errorID for aria-described by
  const describedByIDs : Array<string> = [];
  const hintID = `${name}-hint`;
  const errorID = `${name}-error`;
  if (hintText) {describedByIDs.push(hintID)};
  if (errorText) {describedByIDs.push(errorID)};


  return (
    <div className={formGroupDivClasses} {...testProps}>
      <fieldset className="govuk-fieldset" aria-describedby={describedByIDs.join(' ')} {...fieldsetElementProps}>
        <legend className={legendClasses}>
          {label}
        </legend>
        {hintText && <div id={hintID} className="govuk-hint">{hintText}</div>}
        {errorText  && <p id={errorID} className="govuk-error-message"><span className="govuk-visually-hidden">Error:</span>{errorText}</p> }
        {children}
    </fieldset>
  </div>
  )
}

FieldSet.propTypes = {
  label: PropTypes.string,
  legendIsHeading: PropTypes.bool,
  hintText: PropTypes.string,
  errorText: PropTypes.string,
  children: PropTypes.node,
  fieldsetElementProps: PropTypes.object,
}
