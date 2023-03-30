import React from 'react';
import GDSTextInput from '../../BaseComponents/TextInput/TextInput';
import useAddErrorToPageTitle from '../../../helpers/hooks/useAddErrorToPageTitle';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyDisplay from '../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';

export default function TextInput(props) {
  const {
    label,
    value = '',
    validatemessage,
    onChange,
    helperText,
    inputProps,
    fieldMetadata,
    readOnly,
    name
  } = props;
  let { id } = props;

  const isOnlyField = useIsOnlyField();

  const maxLength = fieldMetadata?.maxLength;

  // TODO consider moving this functionality 'up' especially when we add Error summary,
  // as it may be tidier to call this only once, rather than on every input
  useAddErrorToPageTitle(validatemessage);

  if (readOnly) {
    return <ReadOnlyDisplay label={label} value={value} />;
  }

  // const maxLength = fieldMetadata?.maxLength;

  /* let testProp = {};
  testProp = {
    'data-test-id': testId
  }; */

  const extraInputProps = { onChange, value };

  // TODO Investigate more robust way to check if we should display as password
  if (fieldMetadata?.displayAs === 'pxPassword') {
    extraInputProps['type'] = 'password';
  }

  return (
    <>
      <GDSTextInput
        inputProps={{
          ...inputProps,
          ...extraInputProps
        }}
        hintText={helperText}
        errorText={validatemessage}
        label={label}
        labelIsHeading={isOnlyField}
        name={name}
        maxLength={maxLength}
        id={name}
      />
    </>
  );
}
