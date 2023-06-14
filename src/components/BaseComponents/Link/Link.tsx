import React from 'react';
import PropTypes from 'prop-types';

export default function Link(props) {
  const { onClick, children, attributes } = props;

  return (
    <div className='govuk-button-group'>

      <a className='govuk-link' href='#' onClick={onClick} {...attributes}>
        Save and come back later {children}
      </a>

    </div>
  );
}

Link.propTypes = {
  children: PropTypes.any,
  attributes: PropTypes.object,
  onClick: PropTypes.func
};
