import React from 'react';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';

export default function PConnectComponent(props) {
  const PConnComponent = createPConnectComponent();
  return <PConnComponent {...props} />;
}
