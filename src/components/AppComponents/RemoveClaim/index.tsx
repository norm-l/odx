import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import RadioButtons from '../../BaseComponents/RadioButtons/RadioButtons';

export default function RemoveClaim({ showRemovePage, claimId }) {
  const { t } = useTranslation();

  const [errorMsg, setErrorMsg] = useState('');

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

  // Add user selection logic
  async function handleRemoveProcess() {
    const selectedOption = document.querySelector('input[name="removeTheClaim"]:checked');

    // https://journey-dt1.hmrc.gov.uk/prweb/app/chb-dev/api/application/v2/cases/HMRC-CHB-WORK%20C-511029/processes/RemoveClaim

    if (selectedOption) {
      const selectedOptionValue = selectedOption.getAttribute('value');
      if (selectedOptionValue === 'yes') {
        const sdkConfig = await getSdkConfig();
        // const url = 'https://journey-dt1.hmrc.gov.uk/prweb/app/chb-dev/api/application/v2';
        const url = `${sdkConfig.serverConfig.infinityRestServerUrl}/app/${sdkConfig.serverConfig.appAlias}/api/application/v2/cases/${claimId}/processes/RemoveClaim`;
        // console.log(url2);
        // console.log(claimId);
        // const container = PCore.getContainerUtils().getActiveContainerItemName('app/primary');

        // const processUrl = PCore.getStoreValue(
        //   '.href',
        //   'caseInfo.availableProcesses[0].links.add',
        //   container
        // );

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
            console.log('Removed Case Successfully');
            showRemovePage(false);
            window.location.reload();
          })
          .catch(error => {
            // handle the error
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
                <dd className='govuk-summary-list__value'>23 October 2024</dd>
              </div>
            </dl>
            <RadioButtons
              name='removeTheClaim'
              displayInline
              value=''
              useSmallRadios
              options={radioOptions}
              label='Do you want to remove this claim?'
              errorText=''
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
