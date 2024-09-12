import React from 'react';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';
console.log("REACT: Fired RichText.tsx")
export default function RichText({ value }) {
  const containsParagraphTag = value.includes('<p>');

  return (
    <>
      {containsParagraphTag ? (
        <div className='govuk-body'>
          <ParsedHTML htmlString={value} />
        </div>
      ) : (
        <ParsedHTML htmlString={value} />
      )}
    </>
  );
}
