
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

  const {getPConnect, templateCol} = props;
  getPConnect().setInheritedProp("displayMode", "LABELS_LEFT");
  getPConnect().setInheritedProp("readOnly", true);
  const children = getPConnect()
    .getChildren()
    .map((configObject, index) =>
      createElement(createPConnectComponent(), {
        ...configObject,
        // eslint-disable-next-line react/no-array-index-key
        key: index.toString(),
      })
    );

  if (children.length !== 2) {
    // eslint-disable-next-line no-console
    console.error( `TwoColumn template sees more than 2 columns: ${children.length}`);
  }

  // Calculate the size
  //  Default to assume the 2 columns are evenly split. However, override if templateCol
  //  (example value: "1fr 1fr")
  let aSize: GridSize = 6;
  let bSize: GridSize = 6;

  const colAArray = templateCol.replaceAll(/[a-z]+/g, "").split(/\s/).map(itm => Number(itm));
  const totalCols = colAArray.reduce((v, itm) => itm + v, 0);
  const ratio = 12 / totalCols;
  aSize = (ratio * colAArray[0]) as GridSize;
  bSize = (ratio * colAArray[1]) as GridSize;

 return (
  <>

   {/* <Grid container spacing={1}>
     <Grid item xs={12} md={aSize} classNameName={classNamees.colStyles}>
       {children[0]}
     </Grid>
     <Grid item xs={12} md={bSize} classNameName={classNamees.colStyles}>
       {children[1]}
     </Grid>
   </Grid> */}
    {children.map((child, i) => (
       <StyledHmrcOdxGdsSummaryCardWrapper>
   <div className="govuk-summary-card">
  <div className="govuk-summary-card__title-wrapper">
    <h2 className="govuk-summary-card__title">Child {i}</h2>
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
        {child.props.value}
        </dt>
        <dd className="govuk-summary-list__value">
          English (3DMD)<br/>PGCE with QTS full time
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">
          Date of birth
        </dt>
        <dd className="govuk-summary-list__value">
          School name<br/>Road, City, SW1 1AA
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

HmrcOdxGdsSummaryCard.defaultProps = {
  templateCol: "1fr 1fr",
  // icon: ""
};

HmrcOdxGdsSummaryCard.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  // title: PropTypes.string,
  templateCol: PropTypes.string,
  // icon: PropTypes.string
};
