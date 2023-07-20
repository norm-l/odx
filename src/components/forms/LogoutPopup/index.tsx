import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../BaseComponents/Modal/Modal';
import Button from '../../BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
export default function LogoutPopup(props) {
  const { hideModal, handleSignoutModal, handleStaySignIn } = props;
  const { t } = useTranslation();

  return (
    <Modal show={props.show} handleClose={hideModal}>
      <div>
        <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
        {t("YOU_ARE_ABOUT_TO_SIGNOUT")}
        </h1>
        <p className='govuk-body' aria-hidden='true'>
        {t("YOU_STILL_NEED_TO_SAVE_YOUR_PROGRESS")}
        </p>
        <p className='govuk-body' aria-hidden='true'>
        {t("TO_SAVE_YOUR_PROGRESS")} "TO_SAVE_YOUR_PROGRESS"
        </p>
        <div className='govuk-button-group govuk-!-padding-top-4'>
          <Button
            type="button"
            id='modal-signout-btn'
            attributes={{className:'govuk-button govuk-button--warning'}}
            onClick={handleSignoutModal}
          >
        {t("SIGN-OUT" )}
          </Button>

          <a id='modal-staysignin-btn' className='govuk-link ' href='#' onClick={handleStaySignIn}>
            {t("STAY_SIGNED_IN")}
          </a>
        </div>
      </div>
    </Modal>
  );
}

LogoutPopup.propTypes = {
  show: PropTypes.bool,
  hideModal: PropTypes.func,
  handleSignoutModal: PropTypes.func,
  handleStaySignIn: PropTypes.func
};