import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Modal(props) {
  const { handleClose, show, children } = props;
  const showHideClassName =show ? 'govuk-!-display-block' : 'govuk-!-display-none';


  return (
    <div  className={showHideClassName} tabIndex={-1} role='dialog' aria-modal='true'>

      <section> <button onClick={handleClose}  data-dismiss="modal" >Close</button>{children}</section>
    </div>
  );
}

Modal.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  handleClose: PropTypes.func
};
