import PropTypes from 'prop-types';
import { Input } from '@pega/cosmos-react-core';

import StyledHmrcOdxGdsCheckAnswersScreenWrapper from './styles';


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const HmrcOdxGdsCheckAnswersScreen = props => {
  const { getPConnect, value, placeholder, disabled, readOnly, required, label, hideLabel, testId } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn?.getStateProps()?.value;

  const handleOnChange = event => {
    const { value: updatedValue } = event.target;
    actions.updateFieldValue(propName, updatedValue);
  };

  return (
    <StyledHmrcOdxGdsCheckAnswersScreenWrapper>
      <Input
        type='text'
        value={value}
        label={label}
        labelHidden={hideLabel}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={handleOnChange}
        testId={testId}
      />
    </StyledHmrcOdxGdsCheckAnswersScreenWrapper>
  );
};

HmrcOdxGdsCheckAnswersScreen.defaultProps = {
  value: '',
  placeholder: '',
  disabled: false,
  readOnly: false,
  required: false,
  testId: ''
};

HmrcOdxGdsCheckAnswersScreen.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  testId: PropTypes.string
};

export default HmrcOdxGdsCheckAnswersScreen;
