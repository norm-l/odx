import React, { useRef, useEffect } from 'react';
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
  const dfChildren = arChildren.map((kid, idx) => {
    kid.key = idx;
    // @ts-ignore
    return getPConnect().createComponent(kid.getPConnect().getRawMetadata());
  });

  // Create a ref to the mainer rendering container
  const dfChildrenContainerRef = useRef(null);

  function getSummaryListRows(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const summaryListRows = doc.querySelectorAll('div.govuk-summary-list__row, h2');
    return Array.from(summaryListRows);
  }

  function updateHTML(htmlContent) {
    // setReadOnlyRow(htmlContent);
    const additionalProcessingResult = getSummaryListRows(htmlContent);
    let htmlString = '';
    let openDL = false;

    additionalProcessingResult.forEach(elem => {
      if (elem.tagName === 'H2') {
        if (openDL) {
          htmlString += `</dl>${elem.outerHTML}`;
          openDL = false;
        } else {
          htmlString += elem.outerHTML;
        }
      } else if (elem.tagName === 'DIV') {
        if (!openDL) {
          openDL = true;
          htmlString += `<dl class="govuk-summary-list govuk-!-margin-bottom-9">${elem.outerHTML}`;
        } else {
          htmlString += elem.outerHTML;
        }
      }
    });

    if (openDL) {
      htmlString += '</dl>';
    }
    // Do something with the htmlString
    if (dfChildrenContainerRef.current) {
      dfChildrenContainerRef.current.innerHTML = htmlString;
    }
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      // Access the DOM elements through the ref
      if (dfChildrenContainerRef.current && dfChildren && dfChildren.length > 0) {
        // Access the children of the container
        const children = dfChildrenContainerRef.current.children;
        // Check if children contain the expected content
        if (children && children.length > 0) {
          // Extract HTML content from the first child
          // const htmlContent = children[0].innerHTML;
          let htmlContent = '';
          Array.from(children).forEach((child: unknown) => {
            htmlContent += (child as HTMLElement).innerHTML;
          });

          updateHTML(htmlContent);
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
