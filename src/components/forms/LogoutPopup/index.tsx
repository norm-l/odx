import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../BaseComponents/Modal/Modal';
import { logout } from '../../../helpers/authManager';

export default function LogoutPopup(props) {
  const { show, hideModal, handleSignoutModal, handleStaySignIn } = props;

  return (
    <Modal show={props.show} handleClose={hideModal}>
      <div>
        <h1 id='govuk-timeout-heading'>You’re about to signed out</h1>
        <p className='govuk-body' aria-hidden='true'>
          You still need to save your progress. If you sign out without saving, your progress will
          be lost.
        </p>
        <p className='govuk-body' aria-hidden='true'>
          To save your progress, select the 'Save and come back later' link.
        </p>
        <div className='govuk-button-group govuk-!-padding-top-4'>
          <button
            id='modal-signout-btn'
            className='govuk-button govuk-button--warning'
            onClick={handleSignoutModal}
          >
            Sign out
          </button>

          <a id='modal-staysignin-btn' className='govuk-link ' href='#' onClick={handleStaySignIn}>
            Stay signed in
          </a>
        </div>
      </div>
    </Modal>
  );
}

LogoutPopup.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  handleClose: PropTypes.func,
  hideModal: PropTypes.func,
  handleSignoutModal: PropTypes.func,
  handleStaySignIn: PropTypes.func
};
