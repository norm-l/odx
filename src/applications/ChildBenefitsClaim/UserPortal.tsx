import React from 'react';
import Button from '../../components/BaseComponents/Button/Button';

export default function UserPortal(props){

  const { beginClaim, children } = props;

  return (
    <>
      <div className="govuk-grid-column-two-thirds">
          <h1 className='govuk-heading-xl'>Your claim applications</h1>
      </div>
      <div className="govuk-grid-column-two-thirds">
          <p className='govuk-body'>We&apos;re only listing your cases that need completing for information on claims or applications that have been submitted. Use the contact information to speak with a Benefits Officer</p>
          {children}
      </div>
      <div className='govuk-grid-column-one-third'>
        <span className='govuk-heading-m'>Online</span>
        <a className='govuk-link'>Ask HMRC online</a>
        <Button attributes={{className:'govuk-!-margin-top-4'}} onClick={beginClaim} variant='start'>Begin New Claim</Button>
      </div>
    </>)
}
