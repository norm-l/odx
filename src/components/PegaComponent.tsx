import React from 'react';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';

export default function PegaComponent(reactProps) {
  const { props, portalTarget, styleSheetTarget, componentName } = reactProps;

  const PegaConnectObj = createPConnectComponent();
  console.log('PegaComponent rendered with these props: ', props);
  console.log('Store==', PCore.getStore());

  return (
    <StoreContext.Provider
      displayName={componentName}
      {...props}
      value={{ store: PCore.getStore() }}
      portalTarget={portalTarget}
      styleSheetTarget={styleSheetTarget}
    >
      <PegaConnectObj getPConnect={props.getPConnect} />
    </StoreContext.Provider>
  );
}
