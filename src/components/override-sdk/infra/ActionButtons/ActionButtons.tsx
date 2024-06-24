import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';

export default function ActionButtons(props) {
  const { arMainButtons, arSecondaryButtons, onButtonPress, isUnAuth, isHICBC, getPConnect } =
    props;
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Assignment';
  const taskListStepId = 'SubProcessSF7_AssignmentSF1';
  const thePConn = getPConnect();
  const _containerName = thePConn.getContainerName();
  const _context = thePConn.getContextName();
  const caseInfo = thePConn.getDataObject().caseInfo;
  const screenName = caseInfo?.assignments?.length > 0 ? caseInfo.assignments[0].name : '';
  const containerID = PCore.getContainerUtils()
    .getContainerAccessOrder(`${_context}/${_containerName}`)
    .at(-1);
  const isDeclarationPage = screenName?.toLowerCase().includes('declaration');

  const { t } = useTranslation();
  function _onButtonPress(sAction: string, sButtonType: string) {
    onButtonPress(sAction, sButtonType);
  }
  function navigateToTaskList(event) {
    event.preventDefault();
    thePConn.getActionsApi().navigateToStep(taskListStepId, containerID);
  }

  return (
    <>
      <div className='govuk-button-group govuk-!-padding-top-4'>
        {arMainButtons.map(mButton =>
          mButton.name !== 'Hidden' ? (
            <Button
              variant='primary'
              onClick={e => {
                e.target.blur();
                _onButtonPress(mButton.jsAction, 'primary');
              }}
              key={mButton.actionID}
              attributes={{ type: 'button' }}
            >
              {!isUnAuth && !isHICBC && mButton.name === 'Continue'
                ? t('SAVE_AND_CONTINUE')
                : localizedVal(mButton.name, localeCategory)}
            </Button>
          ) : null
        )}
        {isDeclarationPage && (
          <button
            type='submit'
            className='govuk-button-group govuk-button govuk-button--secondary'
            data-module='govuk-button'
            onClick={e => navigateToTaskList(e)}
          >
            {t('RETURN_TO_CHANGE_CLAIM')}
          </button>
        )}
      </div>

      {!isUnAuth &&
        arSecondaryButtons.map(sButton =>
          sButton.actionID !== 'back' &&
          sButton.name !== 'Hidden' &&
          sButton.name.indexOf('Save') !== -1 ? (
            <Button
              variant='link'
              onClick={e => {
                e.target.blur();
                _onButtonPress(sButton.jsAction, 'secondary');
              }}
              key={sButton.actionID}
              attributes={{ type: 'link' }}
            >
              {localizedVal(sButton.name, localeCategory)}
            </Button>
          ) : null
        )}
    </>
  );
}

ActionButtons.propTypes = {
  arMainButtons: PropTypes.array,
  arSecondaryButtons: PropTypes.array,
  onButtonPress: PropTypes.func,
  isUnAuth: PropTypes.bool,
  isHICBC: PropTypes.bool,
  getPConnect: PropTypes.func.isRequired
  // buildName: PropTypes.string
};

ActionButtons.defaultProps = {
  arMainButtons: [],
  arSecondaryButtons: []
  // buildName: null
};
