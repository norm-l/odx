
import React from "react";
import PropTypes from "prop-types";
import { Grid, GridSize } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import StyledHmrcOdxGdsSummaryCardWrapper from './styles';

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
  const classes = useStyles();

  const {children, templateCol} = props;

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
  <StyledHmrcOdxGdsSummaryCardWrapper>
   {/* <Grid container spacing={1}>
     <Grid item xs={12} md={aSize} className={classes.colStyles}>
       {children[0]}
     </Grid>
     <Grid item xs={12} md={bSize} className={classes.colStyles}>
       {children[1]}
     </Grid>
   </Grid> */}
   <div class="govuk-summary-card">
  <div class="govuk-summary-card__title-wrapper">
    <h2 class="govuk-summary-card__title">University of Gloucestershire</h2>
    <ul class="govuk-summary-card__actions">
      <li class="govuk-summary-card__action"> <a class="govuk-link" href="#">
          Delete choice<span class="govuk-visually-hidden"> of University of Gloucestershire</span>
        </a>
      </li>
      <li class="govuk-summary-card__action"> <a class="govuk-link" href="#">
          Withdraw<span class="govuk-visually-hidden"> from University of Gloucestershire</span>
        </a>
      </li>
    </ul>
  </div>
  <div class="govuk-summary-card__content">
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Course
        </dt>
        <dd class="govuk-summary-list__value">
          English (3DMD)<br/>PGCE with QTS full time
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Location
        </dt>
        <dd class="govuk-summary-list__value">
          School name<br/>Road, City, SW1 1AA
        </dd>
      </div>
    </dl>
  </div>
</div>
   </StyledHmrcOdxGdsSummaryCardWrapper>
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
