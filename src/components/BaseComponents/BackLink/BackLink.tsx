import React from 'react';
import PropTypes from 'prop-types';

export default function BackLink(props) {
  const { onClick, children, attributes } = props;

  return (
    <a href='#' onClick={onClick} {...attributes} className='govuk-back-link govuk-body govuk-!-margin-bottom-3'>
      Back{children}
    </a>
  );
}

BackLink.propTypes = {
  children: PropTypes.any,
  attributes: PropTypes.object,
  onClick: PropTypes.func
};
