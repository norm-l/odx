import { FieldGroup } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';
import React from 'react';

import type { PConnFieldProps } from './PConnProps';

import { StyledHmrcOdxSectionBasedWrapper, StyledRegion } from './styles';

// interface for props
interface HmrcOdxSectionBasedProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  showLabel: boolean;
  // NumCols: string;
  children: any;
}

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxSectionBased(props: HmrcOdxSectionBasedProps) {
  const { children, label, showLabel, getPConnect } = props;
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };

  // const nCols = parseInt(NumCols, 10);

  // console.log(`Rendering ${getPConnect()?.getComponentName()} with ${template} with ${children?.length} Region(s)`);

  return (
    <StyledHmrcOdxSectionBasedWrapper>
      <div className='sectionBased'>
        <FieldGroup name={propsToUse.showLabel ? propsToUse.label : ''}>
          <StyledRegion>{children[0]}</StyledRegion>
          <StyledRegion>{children[1]}</StyledRegion>
          <StyledRegion>{children[2]}</StyledRegion>
        </FieldGroup>
      </div>
    </StyledHmrcOdxSectionBasedWrapper>
  );
}

HmrcOdxSectionBased.defaultProps = {
  // NumCols: 1,
  children: []
};

HmrcOdxSectionBased.propTypes = {
  // NumCols: PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.node)
};
