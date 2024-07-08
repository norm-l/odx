import React, { useEffect, useState } from 'react';
import DateFormatter from '@pega/react-sdk-components/lib/components/helpers/formatters/Date';
import PropTypes from 'prop-types';
import { scrollToTop, GBdate, getServiceShutteredStatus } from '../../components/helpers/utils';
import { useTranslation } from 'react-i18next';
import Button from '../../components/BaseComponents/Button/Button';

declare const PCore: any;

export default function ClaimsList(props) {
  const {
    thePConn,
    data,
    title,
    rowClickAction,
    buttonContent,
    caseId,
    checkShuttered,
    onProceedHandler
  } = props;
  const { t } = useTranslation();
  const [claims, setClaims] = useState([]);
  const statusMapping = status => {
    switch (status) {
      case 'Open-InProgress':
        return { text: t('IN_PROGRESS'), tagColour: 'blue' };
      case 'Pending-CBS':
      case 'Resolved-Completed':
      case 'Resolved-Rejected':
      case 'Pending-ManualInvestigation':
      case 'Pending-verify documentation':
      case 'Pending-awaiting documentation':
      case 'Pending-VerifyDocumentation':
      case 'Pending-SystemError':
      case 'Pending-AwaitingDocumentation':
      case 'Pending-Disallowance':
      case 'Resolved-Disallowance':
        return { text: t('CLAIM_RECEIVED'), tagColour: 'purple' };
      default:
        return { text: status, tagColour: 'grey' };
    }
  };

  const containerManger = thePConn.getContainerManager();
  const resetContainer = () => {
    const context = PCore.getContainerUtils().getActiveContainerItemName(
      `${PCore.getConstants().APP.APP}/primary`
    );
    containerManger.resetContainers({
      context: 'app',
      name: 'primary',
      containerItems: [context]
    });
  };

  async function _rowClick(row: any, e) {
    const { pzInsKey, pyAssignmentID } = row;

    const container = thePConn.getContainerName();
    const target = `${PCore.getConstants().APP.APP}/${container}`;

    if (rowClickAction === 'OpenAssignment') {
      resetContainer();
      const openAssignmentOptions = { containerName: container };
      PCore.getMashupApi()
        .openAssignment(pyAssignmentID, target, openAssignmentOptions)
        .then(() => {
          scrollToTop();
        })
        .catch((err: Error) => console.log('Error : ', err)); // eslint-disable-line no-console
    } else if (rowClickAction === 'OpenCase') {
      const status = await getServiceShutteredStatus();
      if (status) {
        checkShuttered(status);
      } else {
        PCore.getMashupApi()
          .openCase(pzInsKey, target, { pageName: 'SummaryClaim' })
          .then(() => {
            scrollToTop();
          });
      }
    }
    onProceedHandler(e);
  }

  function extractChildren(childrenJSON: string) {
    return JSON.parse(childrenJSON.slice(childrenJSON.indexOf(':') + 1));
  }

  function getClaims() {
    const claimsData = [];
    data.forEach(item => {
      const claimItem = {
        claimRef: item.pyID,
        dateCreated: DateFormatter.Date(item.pxCreateDateTime, { format: 'DD/MM/YYYY' }),
        dateUpdated: item.pxUpdateDateTime,
        children: [],
        childrenAdded: item.Claim.Child.pyFirstName !== null,
        actionButton: (
          <Button
            attributes={{ className: 'govuk-!-margin-top-4 govuk-!-margin-bottom-4' }}
            variant='secondary'
            onClick={e => {
              _rowClick(item, e);
            }}
          >
            {buttonContent}
          </Button>
        ),
        status: statusMapping(item.pyStatusWork)
      };

      if (item.Claim.ChildrenJSON) {
        const additionalChildren = extractChildren(item.Claim.ChildrenJSON);
        additionalChildren.forEach(child => {
          const newChild = {
            firstName: child.name,
            lastName: ' ',
            dob: child.dob ? GBdate(child.dob) : ''
          };
          claimItem.children.push(newChild);
        });
      } else {
        claimItem.children.push({
          firstName: item.Claim.Child.pyFirstName,
          lastName: item.Claim.Child.pyLastName,
          dob: item.Claim.Child.DateOfBirth ? GBdate(item.Claim.Child.DateOfBirth) : ''
        });
      }
      claimsData.push(claimItem);
    });
    return claimsData;
  }

  function getCurrentDate(date) {
    return DateFormatter.Date(date, { format: 'DD MMM YYYY' });
  }

  function renderChildDetails(claimItem) {
    return claimItem.children.map((child, index) => (
      <>
        <dl className='govuk-summary-list govuk-!-margin-bottom-0' key={child.firstName}>
          <div className='govuk-summary-list__row govuk-summary-list__row--no-border'>
            <dt className='govuk-summary-list__key govuk-!-width-one-third govuk-!-padding-bottom-2'>
              {t('YOUNG_PERSON_NAME')}
            </dt>
            <dd className='govuk-summary-list__value govuk-!-width-one-third govuk-!-padding-bottom-2'>
              {child.firstName} {child.lastName}
            </dd>
            <dd className='govuk-summary-list__actions govuk-!-width-one-third govuk-!-padding-bottom-2'>
              {/* If this is the first entry add the status */}
              {index === 0 ? (
                <strong className={`govuk-tag govuk-tag--${claimItem.status.tagColour}`}>
                  {claimItem.status.text}
                </strong>
              ) : (
                <span className='govuk-visually-hidden'>No action</span>
              )}
            </dd>
          </div>
          {child.dob && (
            <div className='govuk-summary-list__row govuk-summary-list__row--no-border'>
              <dt className='govuk-summary-list__key govuk-!-width-one-third govuk-!-padding-bottom-2'>
                {t('DATE_OF_BIRTH')}
              </dt>
              <dd className='govuk-summary-list__value govuk-!-width-one-third govuk-!-padding-bottom-2'>
                {child.dob}
              </dd>
            </div>
          )}

          <div className='govuk-summary-list__row govuk-summary-list__row--no-border'>
            <dt className='govuk-summary-list__key govuk-!-width-one-third govuk-!-padding-bottom-2'>
              {t('CREATED_DATE')}
            </dt>
            <dd className='govuk-summary-list__value govuk-!-width-one-third govuk-!-padding-bottom-2'>
              {claimItem.dateCreated}
            </dd>
            <dd className='govuk-summary-list__actions govuk-!-width-one-third govuk-!-padding-bottom-2'>
              {!claimItem.childrenAdded && (
                <strong className={`govuk-tag govuk-tag--${claimItem.status.tagColour}`}>
                  {claimItem.status.text}
                </strong>
              )}
            </dd>
          </div>
        </dl>
        {claimItem.actionButton}
        {!caseId?.includes(claimItem.claimRef) &&
          (claimItem?.status?.text === 'In Progress' || claimItem?.status?.text === 'Ar Waith') && (
            <p className='govuk-body'>
              {t('PORTAL_WARNING_TEXT')} {getCurrentDate(claimItem?.dateUpdated)}{' '}
              {t('EDUCATION_PORTAL_WARNING_TEXT2')}
            </p>
          )}
        <hr
          className='govuk-section-break govuk-section-break--l govuk-section-break--visible'
          aria-hidden='true'
        ></hr>
      </>
    ));
  }

  useEffect(() => {
    setClaims([...getClaims()]);
  }, [data, title]);

  return (
    <>
      {claims.length !== 0 && <h2 className='govuk-heading-l'>{title}</h2>}

      {claims.map(claimItem => (
        <React.Fragment key={claimItem.claimRef}>
          {claimItem.childrenAdded && renderChildDetails(claimItem)}
        </React.Fragment>
      ))}
    </>
  );
}

ClaimsList.propTypes = {
  thePConn: PropTypes.object,
  data: PropTypes.array,
  title: PropTypes.string,
  rowClickAction: PropTypes.oneOf(['OpenCase', 'OpenAssignment']),
  buttonContent: PropTypes.string,
  caseId: PropTypes.string,
  onProceedHandler: PropTypes.func
};
