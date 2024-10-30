import React, { useState } from 'react';
import DateFormatter from '@pega/react-sdk-components/lib/components/helpers/formatters/Date';
import { useTranslation } from 'react-i18next';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import RadioButtons from '../../BaseComponents/RadioButtons/RadioButtons';

export default function RemoveClaim({ showRemovePage, claimDetails }) {
  const { id, createdDate } = claimDetails;
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');

  const formattedCreatedDate = DateFormatter.Date(createdDate, { format: 'DD/MM/YYYY' });

  const radioOptions = [
    {
      value: 'yes',
      label: `${t('YES')}`
    },
    {
      value: 'no',
      label: `${t('NO')}`
    }
  ];

  // Temporary error message to set
  setErrorMsg('Please select an option');

  // Add user selection logic
  async function handleRemoveProcess() {
    const selectedOption = document.querySelector('input[name="removeTheClaim"]:checked');

    if (selectedOption) {
      const selectedOptionValue = selectedOption.getAttribute('value');
      if (selectedOptionValue === 'yes') {
        const sdkConfig = await getSdkConfig();
        const url = `${sdkConfig.serverConfig.infinityRestServerUrl}/app/${sdkConfig.serverConfig.appAlias}/api/application/v2/cases/${id}/processes/RemoveClaim`;

        const { invokeCustomRestApi } = PCore.getRestClient();
        invokeCustomRestApi(
          `${url}`,
          {
            method: 'POST',
            body: '',
            headers: '',
            withoutDefaultHeaders: false
          },
          ''
        )
          .then(() => {
            showRemovePage(false);
            window.location.reload();
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
      } else {
        showRemovePage(false);
        window.location.reload();
      }
    } else {
      setErrorMsg('Please select an option');
    }
  }

  return (
    <>
      <div className='govuk-grid-row'>
        <div className='govuk-grid-column-two-thirds'>
          <h1 className='govuk-heading-l'>Confirm and remove the current claim in progress </h1>

          <form>
            <dl className='govuk-summary-list'>
              <div className='govuk-summary-list__row'>
                <dt className='govuk-summary-list__key'>Created date</dt>
                {/* translate the created date */}
                <dd className='govuk-summary-list__value'>{formattedCreatedDate}</dd>
              </div>
            </dl>
            <RadioButtons
              name='removeTheClaim'
              displayInline
              value=''
              useSmallRadios
              options={radioOptions}
              label='Do you want to remove this claim?'
              errorText={errorMsg}
            ></RadioButtons>
            <button
              className='govuk-button govuk-!-margin-top-30'
              data-module='govuk-button'
              onClick={handleRemoveProcess}
              type='button'
            >
              {t('SAVE_AND_CONTINUE')}
            </button>

            <p>
              <a className='govuk-link' href=''>
                Save and come back later
              </a>
            </p>
          </form>

          <p>
            <a href='#'>Is this page not working properly? (opens in new tab)</a>
          </p>
        </div>
      </div>
    </>
  );
}
