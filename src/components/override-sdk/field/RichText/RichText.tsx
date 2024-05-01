import React from 'react';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';

export default function RichText(props) {
  // Checking to see if the html includes a p tag.
  // If so we can add the 'govuk-body' class to a div as below
  const containsParagraphTag = props.value.indexOf('<p>') !== -1;

  return (
    <>
      {containsParagraphTag ? (
        <div className='govuk-body'>
          <ParsedHTML htmlString={props.value} />
        </div>
      ) : (
        <ParsedHTML htmlString={props.value} />
      )}
    </>
  );
}
