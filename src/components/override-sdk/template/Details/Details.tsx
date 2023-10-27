import React, {createElement, useContext} from 'react';

import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect'
import DetailsFields from '@pega/react-sdk-components/lib/components/designSystemExtension/DetailsFields';
import ConditionalWrapper from '../../../helpers/formatters/ConditionalWrapper';
import { DefaultFormContext } from '../../../helpers/HMRCAppContext';


export default function Details(props) {
  const { /*children,*/ label, context, getPConnect, readOnly } = props;
  const {DFName} = useContext(DefaultFormContext)
  const arFields: Array<any> = [];

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;

  //Using inherited config as a test to see if this is the root Details on Claim Summary, or embedded for correct wrapping
  const inheritedConfig = getPConnect()._inheritedConfig;
  const localeCategory = 'Assignment';
  // TODO: may be needed after page heading logic is re-worked (value may need changing to point to correct reference)
  // const localeReference = `${getPConnect().getCaseInfo().getClassName()}!CASE!${getPConnect().getCaseInfo().getName()}`.toUpperCase();
  const children = getPConnect()
    .getChildren()
    .map((configObject, index) => createElement(createPConnectComponent(), {
    ...configObject,
    // eslint-disable-next-line react/no-array-index-key
    key: index.toString()
  }));

  for (const child of children) {
    const theChildPConn = child.props.getPConnect();
    theChildPConn.setInheritedProp('displayMode', 'LABELS_LEFT');
    theChildPConn.setInheritedProp('readOnly', true);
    const theChildrenOfChild = theChildPConn.getChildren();
    arFields.push(theChildrenOfChild);
  }

  const contextName = PCore.getContainerUtils().getActiveContainerItemName(`${PCore.getConstants().APP.APP}/primary`);  
  const containerName = PCore.getContainerUtils().getActiveContainerItemName(`${contextName}/workarea`) || contextName;
  
  return (
    // Conditionally wrap in main wrapper only if we are not in a case with and open status (i.e. we are in a finished case, viewing the claim summary)
    <ConditionalWrapper    
      condition={!PCore.getStore().getState().data[containerName].caseInfo?.status.startsWith('Open') && !Object.getOwnPropertyNames(inheritedConfig).length}
      wrapper = {childrenForWrap =>        
      <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className='govuk-grid-column-two-thirds'>
            {childrenForWrap}
          </div>
        </div>
      </main>
      }
      childrenToWrap={
        <>        
          {label && context && <h1 className='govuk-heading-l'>{localizedVal(label, localeCategory /* ,localeReference */)} details</h1>}
          {children} 
        </> 
      }></ConditionalWrapper>                
  )
}


Details.defaultProps = {
  // children: []
};

Details.propTypes = {
  // children: PropTypes.arrayOf(PropTypes.node)
};
