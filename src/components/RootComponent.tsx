import React, { Dispatch, forwardRef } from 'react';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import PConnectComponent from './PConnectComponent';

// Define the props interface
interface RootComponentProps {
  setAssignmentPConn: Dispatch<any>; // Adjust the type as necessary
  children?: React.ReactNode; // If you expect children
}

// ForwardRef does not seem to work here...
const RootComponent = forwardRef<HTMLDivElement, RootComponentProps>((props, ref) => {
  // NOTE: For Embedded mode, we add in displayOnlyFA and isMashup to our React context
  // so the values are available to any component that may need it.
  console.log('ROOT COMPONENT::::', ref);
  return (
    <StoreContext.Provider
      value={{
        store: PCore.getStore(),
        displayOnlyFA: true,
        isMashup: true,
        setAssignmentPConnect: props.setAssignmentPConn
      }}
    >
      <PConnectComponent ref={ref} {...props} />
    </StoreContext.Provider>
  );
});

export default RootComponent;
