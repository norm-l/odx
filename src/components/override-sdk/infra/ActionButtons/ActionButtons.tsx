import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import { isCHBJourney, isEduStartJourney } from '../../../helpers/utils';

export default function ActionButtons(props) {
  console.log("REACT: Fired infra-actionButtons.tsx")
  const { arMainButtons, arSecondaryButtons, onButtonPress, isUnAuth, isHICBC, getPConnect } =
    props;
  const [isDisabled, setIsDisabled] = useState(false);
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Assignment';
  // This is for chb tactical solution only
  const taskListStepId = 'SubProcessSF7_AssignmentSF1';
  const thePConn = getPConnect();
  const _containerName = thePConn.getContainerName();
  const _context = thePConn.getContextName();

  interface ResponseType {
    CurrentStepId: string;
  }

  const containerID = PCore.getContainerUtils()
    .getContainerAccessOrder(`${_context}/${_containerName}`)
    .at(-1);

  const contextWorkarea = PCore.getContainerUtils().getActiveContainerItemName(
    `${PCore.getConstants().APP.APP}/primary`
  );
  const flowActionId = PCore.getStoreValue(
    '.ID',
    'caseInfo.assignments[0].actions[0]',
    contextWorkarea
  );
  const isDeclarationPage = flowActionId?.toLowerCase()?.includes('declaration');
  const isInterruptionPage = flowActionId?.toLowerCase()?.includes('checkdata');

  const { t } = useTranslation();
  function _onButtonPress(sAction: string, sButtonType: string) {
    onButtonPress(sAction, sButtonType);
  }
  function navigateToTaskList(event) {
    event.preventDefault();
    thePConn.getActionsApi().navigateToStep(taskListStepId, containerID);
  }

  function navigateToCYA(event) {
    event.preventDefault();

    const options = {
      invalidateCache: true
    };

    PCore.getDataPageUtils()
      .getPageDataAsync(
        'D_GetStepIdByApplicationAndAction',
        'root',
        {
          FlowActionName: 'CheckYourAnswers',
          CaseID: thePConn.getCaseSummary().content.pyID,
          ...(isEduStartJourney() && { ApplicationName: 'EDStart' })
        },
        options
      ) // @ts-ignore
      .then((pageData: ResponseType) => {
        const stepIDCYA = pageData?.CurrentStepId;
        if (stepIDCYA) {
          thePConn.getActionsApi().navigateToStep(stepIDCYA, containerID);
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  useEffect(() => {
    setIsDisabled(false);
  }, [isDeclarationPage]);

  return (
    <>
      <div className='govuk-button-group govuk-!-padding-top-4'>
        {arMainButtons.map(mButton =>
          mButton.name !== 'Hidden' ? (
            <Button
              variant='primary'
              onClick={e => {
                e.target.blur();
                if (isInterruptionPage) {
                  navigateToCYA(e);
                } else {
                  _onButtonPress(mButton.jsAction, 'primary');
                }
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
        {isDeclarationPage && isCHBJourney() && (
          <Button
            variant='secondary'
            disabled={isDisabled}
            attributes={{ type: 'button' }}
            onClick={e => {
              setIsDisabled(true);
              navigateToTaskList(e);
            }}
          >
            {t('RETURN_TO_CHANGE_CLAIM')}
          </Button>
        )}
        {isDeclarationPage && isEduStartJourney() && (
          <Button
            variant='link'
            onClick={e => {
              navigateToCYA(e);
            }}
          >
            {t('RETURN_TO_CHANGE_ANSWERS')}
          </Button>
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
