import React, { useEffect, useState } from 'react';
import Button from '../../../components/BaseComponents/Button/Button';
import PropTypes from 'prop-types';
import { scrollToTop } from '../../helpers/utils';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

declare const PCore: any;

export default function RegistrationDetails(props) {
  const { thePConn, data, rowClickAction, buttonContent } = props;
  const { t } = useTranslation();
  const [registration, setRegistration] = useState([]);

  const statusMapping = status => {
    switch (status) {
      case 'Open-InProgress':
        return { text: t('SAVED'), tagColour: 'blue' };
      case 'Resolved-Completed':
      case 'Resolved-Rejected':
          return { text: t('REGISTRATION_RECEIVED'), tagColour: 'purple' };
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

  async function _rowClick(row: any) {
    const { pyAssignmentID } = row;

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
    } 
  }

  function getSARegistraion() {
    const registrationData = [];
    data.forEach(item => {
      const dataItem = {
        SARegRef: item.pyID,
        dateCreated: dayjs(item.pxCreateDateTime).format('DD MMMM YYYY'),
        dateUpdated: item.pxUpdateDateTime,
        registrantAdded: item.SARegistration.Registrant.pyFirstName !== null,
        actionButton: (
          <Button
            attributes={{ className: '' }}
            variant='primary'
            onClick={() => {
              _rowClick(item);
            }}
          >
            {buttonContent}
          </Button>
        ),
        status: statusMapping(item.pyStatusWork)
      };
      registrationData.push(dataItem);
    });
    return registrationData;
  }

  useEffect(() => {
    setRegistration([...getSARegistraion()]);
  }, [data, buttonContent]);

  return (
    <>
      {registration.map(dataItem => (
        <React.Fragment key={dataItem.SARegRef}>
          <dl className='govuk-summary-list'>
            <div className='govuk-summary-list__row govuk-summary-list__row'>
              <dt className='govuk-summary-list__key govuk-!-width-one-third'>
                {t('DATE_CREATED')}
              </dt>
              <dd className='govuk-summary-list__value govuk-!-width-one-third'>
                {dataItem.dateCreated}
              </dd>
              <dd className='govuk-summary-list__value govuk-!-width-one-third'>
                <strong className={`govuk-tag govuk-tag--${dataItem.status.tagColour}`}>
                  {dataItem.status.text}
                </strong>
              </dd>
            </div>
          </dl>

          {dataItem.actionButton}

        </React.Fragment>
      ))}
    </>
  );
}

RegistrationDetails.propTypes = {
  thePConn: PropTypes.object,
  data: PropTypes.array,
  rowClickAction: PropTypes.oneOf(['OpenAssignment']),
  buttonContent: PropTypes.string
};
