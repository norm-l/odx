// utilizing theming, comment out, if want individual style
// import styled from 'styled-components';
// import { Configuration } from '@pega/cosmos-react-core';

// export default styled(Configuration)``;

// individual style, comment out above, and uncomment here and add styles
import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    .sectionBased {
      padding: 20px;
      background-color: #f5f5f5;
    }

    .region {
      border-radius: 5px;
      padding: 20px;
      background-color: #ffffff;
    }
  `;
});

// export const StyledHmrcOdxSectionBasedWrapper = styled.div`
//   .sectionBased {
//     padding: 20px;
//     background-color: #f5f5f5;
//   }
// `;
