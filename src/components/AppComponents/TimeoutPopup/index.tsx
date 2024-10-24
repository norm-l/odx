import React, { useEffect, useCallback, useReducer } from 'react';
import Modal from '../../BaseComponents/Modal/Modal';
import Button from '../../BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function TimeoutPopup(props) {
  const {
    show,
    millisecondsTillSignout,
    staySignedinHandler,
    signoutHandler,
    staySignedInButtonText,
    signoutButtonText,
    children
  } = props;

  const staySignedInCallback = useCallback(
    event => {
      if (event.key === 'Escape') staySignedinHandler();
    },
    [staySignedinHandler]
  );

  const { t } = useTranslation();

  const initialTimeoutState = {
    countdownStart: false,
    timeRemaining: 60,
    screenReaderCountdown: ''
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'START_COUNTDOWN':
        return { ...state, countdownStart: action.payload };
      case 'UPDATE_TIME_REMAINING':
        return { ...state, timeRemaining: action.payload };
      case 'UPDATE_SCREEN_READER_COUNTDOWN':
        return { ...state, screenReaderCountdown: action.payload };
      default:
        return state;
    }
  };

  const [timeoutState, dispatch] = useReducer(reducer, initialTimeoutState);

  useEffect(() => {
    if (!show) {
      // Reset countdown and related states if show is false
      dispatch({ type: 'UPDATE_TIME_REMAINING', payload: 60 });
      dispatch({ type: 'UPDATE_SCREEN_READER_COUNTDOWN', payload: '' });
      dispatch({ type: 'START_COUNTDOWN', payload: false });
    } else {
      // Start the countdown only if show is true
      const milisecondsTilCountdown = millisecondsTillSignout - 60000;
      const countdownTimeout = setTimeout(() => {
        dispatch({ type: 'START_COUNTDOWN', payload: true });
      }, milisecondsTilCountdown);

      return () => {
        clearTimeout(countdownTimeout);
      };
    }
  }, [show]);

  useEffect(() => {
    if (timeoutState.countdownStart) {
      if (timeoutState.timeRemaining === 60) {
        dispatch({
          type: 'UPDATE_SCREEN_READER_COUNTDOWN',
          payload: `${t('FOR_YOUR_SECURITY_WE_WILL_SIGN_YOU_OUT')} ${t('1_MINUTE')}`
        });
      }

      if (timeoutState.timeRemaining === 0) return;

      const timeRemainingInterval = setInterval(() => {
        dispatch({ type: 'UPDATE_TIME_REMAINING', payload: timeoutState.timeRemaining - 1 });
      }, 1000);

      return () => clearInterval(timeRemainingInterval);
    }
  }, [timeoutState.countdownStart, timeoutState.timeRemaining]);

  useEffect(() => {
    if (timeoutState.timeRemaining < 60 && timeoutState.timeRemaining % 20 === 0) {
      dispatch({
        type: 'UPDATE_SCREEN_READER_COUNTDOWN',
        payload: `${t('FOR_YOUR_SECURITY_WE_WILL_SIGN_YOU_OUT')} ${timeoutState.timeRemaining} ${t(
          'SECONDS'
        )}`
      });
    }
  }, [timeoutState.timeRemaining]);

  useEffect(() => {
    if (timeoutState.timeRemaining === 0) {
      const signoutHandlerTimeout = setTimeout(() => {
        signoutHandler();
      }, 1000);

      return () => {
        clearTimeout(signoutHandlerTimeout);
      };
    }
  }, [timeoutState.timeRemaining]);

  useEffect(() => {
    if (show) {
      window.addEventListener('keydown', staySignedInCallback);
    } else {
      window.removeEventListener('keydown', staySignedInCallback);
    }
    return () => {
      window.removeEventListener('keydown', staySignedInCallback);
    };
  }, [show]);
  const timeoutText = () => {
    const { countdownStart, timeRemaining } = timeoutState;

    if (countdownStart) {
      if (timeRemaining === 60) {
        return `${t('1_MINUTE')}.`;
      } else if (timeRemaining === 1) {
        return `${timeRemaining} ${t('SECOND')}.`;
      } else if (timeRemaining < 60 || timeRemaining === 0) {
        return `${timeRemaining} ${t('SECONDS')}.`;
      }
    }

    return `${t('2_MINUTES')}.`;
  };

  if (children) {
    return (
      <Modal show={show} id='timeout-popup'>
        <div>
          {children}
          <div className='govuk-button-group govuk-!-padding-top-4'>
            <Button type='button' onClick={staySignedinHandler}>
              {staySignedInButtonText}
            </Button>

            <a id='modal-signout-btn' className='govuk-link' href='#' onClick={signoutHandler}>
              {signoutButtonText}
            </a>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal show={show} id='timeout-popup'>
      <div>
        <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
          {t('YOURE_ABOUT_TO_BE_SIGNED_OUT')}
        </h1>
        <p className='govuk-body'>
          {`${t('FOR_YOUR_SECURITY_WE_WILL_SIGN_YOU_OUT')} `}
          <span className='govuk-!-font-weight-bold'>{timeoutText()}</span>
          {timeoutState.countdownStart && (
            <span className='govuk-visually-hidden' aria-live='polite'>
              {timeoutState.screenReaderCountdown}
            </span>
          )}
        </p>
        <div className='govuk-button-group govuk-!-padding-top-4'>
          <Button type='button' onClick={staySignedinHandler}>
            {t('STAY_SIGNED_IN')}
          </Button>

          <a id='modal-staysignin-btn' className='govuk-link' href='#' onClick={signoutHandler}>
            {t('SIGN-OUT')}
          </a>
        </div>
      </div>
    </Modal>
  );
}

TimeoutPopup.propTypes = {
  show: PropTypes.bool,
  millisecondsTillSignout: PropTypes.number,
  staySignedinHandler: PropTypes.func,
  signoutHandler: PropTypes.func,
  staySignedInButtonText: PropTypes.string,
  signoutButtonText: PropTypes.string,
  children: PropTypes.any,
};
