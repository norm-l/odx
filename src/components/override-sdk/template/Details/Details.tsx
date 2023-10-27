import React from 'react';

import DetailsFields from '@pega/react-sdk-components/lib/components/designSystemExtension/DetailsFields';
import MainWrapper from '../../../BaseComponents/MainWrapper';


export default function Details(props) {
  const { children, label, context } = props;
  const arFields: Array<any> = [];

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Assignment';
  // TODO: may be needed after page heading logic is re-worked (value may need changing to point to correct reference)
  // const localeReference = `${getPConnect().getCaseInfo().getClassName()}!CASE!${getPConnect().getCaseInfo().getName()}`.toUpperCase();


  for (const child of children) {
    const theChildPConn = child.props.getPConnect();
    theChildPConn.setInheritedProp('displayMode', 'LABELS_LEFT');
    theChildPConn.setInheritedProp('readOnly', true);
    const theChildrenOfChild = theChildPConn.getChildren();
    arFields.push(theChildrenOfChild);
  }

  return (<>
        <MainWrapper>
          {label && context && <h1 className='govuk-heading-l'>{localizedVal(label, localeCategory /* ,localeReference */)} details</h1>}
          <DetailsFields fields={arFields[0]}/>
        </MainWrapper>
  </>)
}


Details.defaultProps = {
  // children: []
};

Details.propTypes = {
  // children: PropTypes.arrayOf(PropTypes.node)
};
