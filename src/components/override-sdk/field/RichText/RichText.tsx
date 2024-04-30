import React from 'react';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';

export default function RichText(props) {
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
