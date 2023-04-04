import React from "react";
import PropTypes from "prop-types";
import Button from '../BaseComponents/Button/Button';

export default function ActionButtons(props) {
  const { arMainButtons, arSecondaryButtons, onButtonPress } = props;

  function _onButtonPress(sAction: string, sButtonType: string) {
    onButtonPress(sAction, sButtonType);
  }

  return (
    <div className='govuk-button-group govuk-!-padding-top-4'>
      {arMainButtons.map(mButton => (
        <Button
          variant='primary'
          onClick={(e) => {
<<<<<<< HEAD
            e.target.blur()
=======
            e.target.blur();
>>>>>>> 0be7c5261cea8ff666146627a771659b48b97d50
            _onButtonPress(mButton.jsAction, 'primary');
          }}
          key={mButton.actionID}
          attributes={{type:"button"}}
        >
          {mButton.name}
        </Button>
      ))}
      {arSecondaryButtons.map(sButton => (
        <Button
          variant='secondary'
          onClick={(e) => {
            e.target.blur()
            _onButtonPress(sButton.jsAction, 'secondary');
          }}
          key={sButton.actionID}
          attributes={{type:"button"}}
        >
          {sButton.name}
        </Button>
      ))}
    </div>
  );
}

ActionButtons.propTypes = {
  arMainButtons: PropTypes.array,
  arSecondaryButtons: PropTypes.array,
  onButtonPress: PropTypes.func
  // buildName: PropTypes.string
};

ActionButtons.defaultProps = {
  arMainButtons: [],
  arSecondaryButtons: []
  // buildName: null
};
