import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../BaseComponents/Modal/Modal';

export default function LogoutPopup(props) {
  const{
    show,
    hideModal,

  }=props
  // const [show, setShow] = useState(props.show);
  // const showModal = () => {
  //   console.log("hello")
  //   setShow(true);
  // };

  // const hideModal = () => {
  //   console.log("hiiii")
  //   setShow(false);
  // };
  // if(props.show && !show ){
  //   setShow(true);
  // }
  return (

    <Modal show={props.show} handleClose={hideModal}>
      <div>
        <h1 id='govuk-timeout-heading'>You’re about to be signed out</h1>
        <p className='govuk-body govuk-timeout-dialog__message' aria-hidden='true'>
          You still need to save your progress. If you sign out without saving, your progress will
          be lost.
        </p>
        <p className='govuk-body govuk-timeout-dialog__message' aria-hidden='true'>
          To save your progress, select the 'Save and come back later' link.
        </p>
        <div className='govuk-button-group govuk-!-padding-top-4'>
          <button id='hmrc-timeout-keep-signin-btn' className='govuk-button govuk-button--warning'>
            Sign out
          </button>

          <a
            id='govuk-timeout-sign-out-link'
            className='govuk-link govuk-timeout-dialog__link'
            href='?lang=English'
          >
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
  hideModal:PropTypes.func,
};
