import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function ErrorSummary(props) {
  const { messages } = props;

  const errorSummaryRef = useRef<any>(null);

  useEffect( () => {
    if(errorSummaryRef && errorSummaryRef?.current){
      errorSummaryRef.current.focus()
    }}, [errorSummaryRef])

  return (
    <div ref={errorSummaryRef} className='govuk-error-summary' data-module='govuk-error-summary' tabIndex={-1} >
      <div role='alert'>
        <h2 className='govuk-error-summary__title'>There is a problem</h2>
        <div className='govuk-error-summary__body'>
          <ul className='govuk-list govuk-error-summary__list'>
              {messages.map(message => {
                return <li>
                  <a href={`#${message?.value.slice(1)}`}>{message.validatemessage}</a>
                </li>
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}

ErrorSummary.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({value: PropTypes.string, validatemessage: PropTypes.string})),
};
