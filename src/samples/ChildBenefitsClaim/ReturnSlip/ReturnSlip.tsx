import React from 'react';
import ParsedHTML from '../../../components/helpers/formatters/ParsedHtml';

export default function ReturnSlip ({content}) {
  return (<html><head></head><body><ParsedHTML htmlString={content}/></body></html>);
}
