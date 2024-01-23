import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import ActionButtons from '../ActionButtons';

export default function AssignmentCard(props) {
  const { children, actionButtons, onButtonPress, getPConnect } = props;

  const [arMainButtons, setArMainButtons] = useState([]);
  const [arSecondaryButtons, setArSecondaryButtons] = useState([]);
  // const containerName = getPConnect().getContainerName();
  const containername = PCore.getContainerUtils().getActiveContainerItemName(
    `${PCore.getConstants().APP.APP}/primary`
  );
  console.log('*****CONTAINER NAME*****', containername);
  const context = PCore.getContainerUtils().getActiveContainerItemName(`${containername}/workarea`);
  // const context = PCore.getContainerUtils().getActiveContainerItemContext(
  //   `${PCore.getConstants().APP.APP}/${containerName}`
  // );
  console.log('******CONTEXT**************', context);
  const UnAuth = PCore.getStoreValue('.UserName', 'referencedUsers.Model_Unauth', context);
  console.log('*********UNAUTH***********', UnAuth);
  const isUnAuthJourney = UnAuth === 'Model Unauth' ? true : false;

  useEffect(() => {
    if (actionButtons) {
      setArMainButtons(actionButtons.main);
      setArSecondaryButtons(actionButtons.secondary);
    }
  }, [actionButtons]);

  function buttonPress(sAction, sType) {
    onButtonPress(sAction, sType);
  }

  return (
    <>
      {children}
      {arMainButtons && arSecondaryButtons && (
        <ActionButtons
          arMainButtons={arMainButtons}
          arSecondaryButtons={arSecondaryButtons}
          onButtonPress={buttonPress}
          isUnAuthJourney={isUnAuthJourney}
        ></ActionButtons>
      )}
    </>
  );
}

AssignmentCard.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  itemKey: PropTypes.string,
  actionButtons: PropTypes.object,
  onButtonPress: PropTypes.func
  // buildName: PropTypes.string
};

AssignmentCard.defaultProps = {
  itemKey: null
  // buildName: null
};
