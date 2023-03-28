import React from 'react';

const ConfirmationPage = () => {
  // const getPConnect = props;
  // const pConn = getPConnect();
  // const caseId = pConn.getCaseInfo().getID();
  // const caseId = PCore.caseId

  return (
    <div className='govuk-grid-column-two-thirds'>
      <div className='govuk-panel govuk-panel--confirmation'>
        <h1 className='govuk-panel__title'>Application for Child Benefit complete</h1>
      </div>
      <h2 className='govuk-heading-m'>What happens next</h2>
      <p className='govuk-body'>We&apos;ve sent your application to Child Benefit Service.</p>
      <p className='govuk-body'>
        We&apos;ll tell you in 14 calendar days if your application has been successful.
      </p>
    </div>
  );
};

export default ConfirmationPage;
