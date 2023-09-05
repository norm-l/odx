
import React, {createElement}from "react";
import PropTypes from "prop-types";
import { Grid, GridSize } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import StyledHmrcOdxGdsSummaryCardWrapper from './styles';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';

const useStyles = makeStyles(() => ({
  colStyles: {
    display: "grid",
    gap: "1rem",
    alignContent: "baseline",
  },
}));


// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsSummaryCard(props) {
  const classNamees = useStyles();

  const {getPConnect,useType} = props;
 

 
  const children = getPConnect()

    .getChildren()
    .map((configObject, index) =>
      createElement(createPConnectComponent(), {
        ...configObject,
        // eslint-disable-next-line react/no-array-index-key
        key: index.toString(),
      })
    );
   
    switch (useType) {
      case '1':
       console.log("Multichild")
        break;
     
    }

 return (
  <>
     {children[0].props.children.map((child, i) => ( 
       <StyledHmrcOdxGdsSummaryCardWrapper>
   <div className="govuk-summary-card">
  <div className="govuk-summary-card__title-wrapper">
    <h2 key={child} className="govuk-summary-card__title">Child {i+1}</h2>
    <ul className="govuk-summary-card__actions">
      <li className="govuk-summary-card__action"> <a className="govuk-link" href="#">
          Remove<span className="govuk-visually-hidden"> of University of Gloucestershire</span>
        </a>
      </li>
      <li className="govuk-summary-card__action"> <a className="govuk-link" href="#">
          Change<span className="govuk-visually-hidden"> from University of Gloucestershire</span>
        </a>
      </li>
    </ul>
  </div>
  <div className="govuk-summary-card__content">
    <dl className="govuk-summary-list">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">
      First name
        </dt>
        <dd className="govuk-summary-list__value">
      {child.config.value}
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">
          Date of birth
        </dt>
        <dd className="govuk-summary-list__value">
        {child.config.value}
        </dd>
      </div>
    </dl>
  </div>
</div>
   </StyledHmrcOdxGdsSummaryCardWrapper>
   ))}  
   <button className="govuk-button govuk-button--secondary" data-module="govuk-button">
   Add another child
 </button>
 </>
 )

}



HmrcOdxGdsSummaryCard.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  // title: PropTypes.string,
 
};
