import React from 'react';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';

export default function PegaComponent(reactProps) {
  const { props, portalTarget, styleSheetTarget } = reactProps;

  const PegaConnectObj = createPConnectComponent();

  return (
    <StoreContext.Provider
      {...props}
      value={{ store: PCore.getStore() }}
      portalTarget={portalTarget}
      styleSheetTarget={styleSheetTarget}
    >
      <PegaConnectObj {...props} />
    </StoreContext.Provider>
  );
}
