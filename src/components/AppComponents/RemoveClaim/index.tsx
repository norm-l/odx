import React from 'react';
// import { useTranslation } from 'react-i18next';
import Button from '../../BaseComponents/Button/Button';

export default function RemoveClaim() {
  function handleRemoveProcess() {
    const url = 'https://journey-dt1.hmrc.gov.uk/prweb/app/chb-dev/api/application/v2';
    const container = PCore.getContainerUtils().getActiveContainerItemName('app/primary');

    const processUrl = PCore.getStoreValue(
      '.href',
      'caseInfo.availableProcesses[0].links.add',
      container
    );

    const { invokeCustomRestApi } = PCore.getRestClient();
    invokeCustomRestApi(
      `${url}${processUrl}`,
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
        window.location.reload();
      })
      .catch(error => {
        // handle the error
        console.log(error);
      });
  }

  return (
    <div className='govuk-button-group govuk-!-padding-top-4'>
      <Button type='button' onClick={() => handleRemoveProcess()}>
        Remove Claim
      </Button>
    </div>
  );
}
