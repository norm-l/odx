import React, { useRef, useEffect, useState } from 'react';

import { getInstructions } from './utils';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import './DefaultForm.css';

import StyledHmrcOdxGdsCheckAnswersPageWrapper from './styles';

interface HmrcOdxGdsCheckAnswersPageProps extends PConnProps {
  // If any, enter additional props that only exist on this componentName
  NumCols?: string;
  instructions?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  children: Array<any>;
}

export default function HmrcOdxGdsCheckAnswersPage(props: HmrcOdxGdsCheckAnswersPageProps) {
  // template structure setup
  const { getPConnect, NumCols = '1' } = props;
  const instructions = getInstructions(getPConnect(), props.instructions);

  let divClass: string;

  const numCols = NumCols || '1';
  switch (numCols) {
    case '1':
      divClass = 'psdk-default-form-one-column';
      break;
    case '2':
      divClass = 'psdk-default-form-two-column';
      break;
    case '3':
      divClass = 'psdk-default-form-three-column';
      break;
    default:
      divClass = 'psdk-default-form-one-column';
      break;
  }

  const arChildren = getPConnect().getChildren()[0].getPConnect().getChildren();
  const dfChildren = arChildren.map((kid, idx) =>
    // eslint-disable-next-line react/no-array-index-key
    // createElement(createPConnectComponent(), { ...kid, key: idx })
    {
      kid.key = idx;
      // @ts-ignore
      return getPConnect().createComponent(kid.getPConnect().getRawMetadata());
    }
  );

  function getSummaryListRows(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const summaryListRows = doc.querySelectorAll('div.govuk-summary-list__row');
    return Array.from(summaryListRows);
  }

  // Create a ref
  const dfChildrenContainerRef = useRef(null);
  const [readOnlyRow, setReadOnlyRow] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      // Access the DOM elements through the ref
      if (dfChildrenContainerRef.current && dfChildren && dfChildren.length > 0) {
        // Access the children of the container
        const children = dfChildrenContainerRef.current.children;
        // Check if children contain the expected content
        if (children && children.length > 0) {
          // Extract HTML content from the first child
          const htmlContent = children[0].innerHTML;
          // Update the state with the HTML content
          setReadOnlyRow(htmlContent);

          // eslint-disable-next-line no-console
          console.log('readOnlyRow', readOnlyRow);

          const additionalProcessingResult = getSummaryListRows(readOnlyRow);
          // eslint-disable-next-line no-console
          console.log(additionalProcessingResult);
        }
      }
    }, 0);

    return () => clearTimeout(timerId); // Cleanup the timer
  }, [dfChildren]);

  return (
    <StyledHmrcOdxGdsCheckAnswersPageWrapper>
      <>
        {instructions && (
          <div className='psdk-default-form-instruction-text'>
            {/* server performs sanitization method for instructions html content */}
            {/* eslint-disable react/no-danger */}
            <div key='instructions' dangerouslySetInnerHTML={{ __html: instructions }} />
          </div>
        )}
        <div ref={dfChildrenContainerRef} className={divClass}>
          {dfChildren}
        </div>
      </>
    </StyledHmrcOdxGdsCheckAnswersPageWrapper>
  );
}
