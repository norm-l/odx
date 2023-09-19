
import React, { ReactNode, useEffect, useState, Fragment } from 'react';
import { Grid} from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import StyledHmrcOdxGdsSummaryCardWrapper from './styles';

export default function HmrcOdxGdsSummaryCard(props) {
  const {
    children,
    NumCols,
    sectionHeader,
    getPConnect,
    useType = 1
  } = props;

  const containerItemID = getPConnect().getContextName();

  const { t } = useTranslation();

  const nCols = parseInt( NumCols,8 );
  const [formElms, setFormElms] = useState<Array<ReactNode>>([]); // Initialize as an empty array of React Nodes

  // let useTitle;
  let itemName;
  if(useType === 1) {
    // useTitle = t('GDS_INFO_CHILDREN');
    itemName = t('GDS_INFO_ITEM_CHILD');
  }

  useEffect(() => {
    const elms : Array<string> = [];
    const region = children[0] ? children[0].props.getPConnect() : null;
    if (region?.getChildren()) {
      region.getChildren().forEach(child => {
        child.getPConnect().setInheritedProp('readOnly', true);
        elms.push(child.getPConnect().getComponent());
      });
      setFormElms(elms);
    }
  }, [children[0]]);

  const handleOnClick = (e) => {
    const action = e.currentTarget.text;
    // console.log(action);
    switch (action) {
      case 'Remove Child': // Need to make dynamic and more robust
        // getPConnect().setInheritedProp(".UserActions", "Remove");
        getPConnect().setValue(".UserActions", "Remove");
        // handleEvent(getPConnect().getActionsApi(), 'change', '.UserActions', 'Remove');
        getPConnect().getActionsApi().finishAssignment(containerItemID);
        // console.log('Invoke remove')
        break;
      case 'Change Child': // Need to make dynamic and more robust
        // getPConnect().setInheritedProp("UserActions", "Amend");
        getPConnect().setValue(".UserActions", "Amend");
        // handleEvent(getPConnect().getActionsApi(), 'change', '.UserActions', 'Amend');
        getPConnect().getActionsApi().finishAssignment(containerItemID);
        // console.log('Invoke amend')
        break;
      // case 'Add Child': // Need to make dynamic and more robust
      //   // getPConnect().setInheritedProp("UserActions", "Amend");
      //   // getPConnect().setValue("UserActions", "Amend");
      //   handleEvent(getPConnect().getActionsApi(), 'change', '.AddToList', 'Yes');
      //   getPConnect().getActionsApi().finishAssignment(containerItemID);
      //   // console.log('Invoke amend')
      //   break;
      default:
        // console.log('default')
        break;
    }
  };

  return (
    <StyledHmrcOdxGdsSummaryCardWrapper>
      <h2>{sectionHeader}</h2>
      <Grid
        container={{
          cols: `repeat(${nCols}, minmax(0, 1fr))`,
          gap: 2
        }}
      >
        <div className="govuk-summary-card">
          <div className="govuk-summary-card__title-wrapper">
            <h2 className="govuk-summary-card__title">{itemName}</h2> {/* TODO add incremental number */}
            <ul className="govuk-summary-card__actions">
              <li className="govuk-summary-card__action"> <a className="govuk-link" href="#" onClick={handleOnClick}>
                  {t('GDS_ACTION_REMOVE')}<span className="govuk-visually-hidden"> {itemName}</span>
                </a>
              </li>
              <li className="govuk-summary-card__action"> <a className="govuk-link" href="#" onClick={handleOnClick}>
                  {t('GDS_ACTION_CHANGE')}<span className="govuk-visually-hidden"> {itemName}</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="govuk-summary-card__content">
            <dl className='govuk-summary-list'>
              {formElms.map((field, index) => {
                const formattedValue =
                  typeof field === 'object' && field !== null && 'props' in field && field.props?.DateTimeFormat
                    ? new Date((field as any)?.props?.value).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : (field as any)?.props?.value;

                const key = new Date().getTime()+index;

                return (
                  <Fragment key={key}>
                    <div className="govuk-summary-list__row">
                      <dt className="govuk-summary-list__key">
                        {(field as any).props.label}
                      </dt>
                      <dd className="govuk-summary-list__value">
                        {formattedValue}
                      </dd>
                      {/* <dd className='govuk-summary-list__actions'>
                        <Link className='govuk-link' href='#' onClick={handleOnClick}>
                          Change<span className='govuk-visually-hidden'> {(field as any).props.label}</span>
                        </Link>
                      </dd> */}
                    </div>
                  </Fragment>
                );
              })}
            </dl>
          </div>
        </div>
      </Grid>
    </StyledHmrcOdxGdsSummaryCardWrapper>
  );
}

HmrcOdxGdsSummaryCard.defaultProps = {
  NumCols: 1
};

HmrcOdxGdsSummaryCard.propTypes = {
  sectionHeader: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  NumCols: PropTypes.number
};





// import React, {createElement}from "react";
// import PropTypes from "prop-types";
// import { Grid, GridSize } from "@material-ui/core";
// import { makeStyles } from '@material-ui/core/styles';

// import StyledHmrcOdxGdsSummaryCardWrapper from './styles';
// import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
// import { handleChange } from "@pega/pcore-pconnect-typedefs/types/pcore/expression/expression-engine";

// const useStyles = makeStyles(() => ({
//   colStyles: {
//     display: "grid",
//     gap: "1rem",
//     alignContent: "baseline",
//   },
// }));


// // Duplicated runtime code from React SDK

// // props passed in combination of props from property panel (config.json) and run time props from Constellation
// // any default values in config.pros should be set in defaultProps at bottom of this file
// export default function HmrcOdxGdsSummaryCard(props) {
//   const classNamees = useStyles();
   
//   const {getPConnect,useType} = props;
 
//   const thePConn = getPConnect();
 
//   const children = thePConn

//     .getChildren()
//     .map((configObject, index) =>
//       createElement(createPConnectComponent(), {
//         ...configObject,
//         // eslint-disable-next-line react/no-array-index-key
//         key: index.toString(),
//       })
//     );
  
//     let useTitle;
//     switch (useType) {
//       case '1': 
//         useTitle = "Multichildren";
//         break;
     
//     }
//     const handleChange = event => {
//       thePConn.setInheritedProp("UserActions", "Amend")
//       thePConn.getActionsApi().finishAssignment(thePConn.getContextName())
//     };
//     const handleRemove = event =>{
//       thePConn.setInheritedProp("UserActions", "Remove")
//       thePConn.getActionsApi().finishAssignment(thePConn.getContextName())
//     }
  
//  return (
//   <>
//      {children.map((child, i) => (
//        <StyledHmrcOdxGdsSummaryCardWrapper>
//    <div className="govuk-summary-card">
//   <div className="govuk-summary-card__title-wrapper">
//     <h2 key={child} className="govuk-summary-card__title">Child {i+1}</h2>
//     <ul className="govuk-summary-card__actions">
//       <li className="govuk-summary-card__action"> <a className="govuk-link" href="#"  onClick={handleRemove}>
//           Remove
//         </a>
//       </li>
//       <li className="govuk-summary-card__action"> <a className="govuk-link" href="#" onClick={handleChange}>
//           Change
//         </a>
//       </li>
//     </ul>
//   </div>
//   <div className="govuk-summary-card__content">
//     <dl className="govuk-summary-list">
//       <div className="govuk-summary-list__row">
//         <dt className="govuk-summary-list__key">
//       First name
//         </dt>
//         <dd className="govuk-summary-list__value">
//         {child.props.children[0].config.value}
//         </dd>
//       </div>
//       <div className="govuk-summary-list__row">
//         <dt className="govuk-summary-list__key">
//           Date of birth
//         </dt>
//         <dd className="govuk-summary-list__value">
//         {child.props.children[1].config.value}
//         </dd>
//       </div>
//     </dl>
//   </div>
// </div>
//    </StyledHmrcOdxGdsSummaryCardWrapper>
//    ))}  
//    <button className="govuk-button govuk-button--secondary" data-module="govuk-button">
//    Add another child
//  </button>
//  </>
//  )

// }



// HmrcOdxGdsSummaryCard.propTypes = {
//   children: PropTypes.arrayOf(PropTypes.node).isRequired,
//   // title: PropTypes.string,
 
// };
