import React from 'react';
import Button from '../../components/BaseComponents/Button/Button';

export default function UserPortal(props){

  const { beginClaim, children } = props;

  return (
    <>
      <div className="govuk-grid-column-two-thirds">
          <h1 className='govuk-heading-l'>Your claim applications</h1>
          <p className='govuk-body'>We&apos;re only listing your cases that need completing for information claims or applications that have been submitted. Use the contact information to speak with a Benefits Officer</p>
          {children}
      </div>
      <div className="govuk-grid-column-one-third">
        <div className='govuk-body'>
          Call the Child Benefit helpline if you need to speak with us or use the chat
          <br/><br/>
          You&apos;ll need:
          <li> National Insurance Number</li>
          <br/>
          <div className='govuk-details__text'>
            Child Benefit helpline <br/>
            Telephone: 0300 200 3100 <br/>
            Welsh language: 0300 200 1900 <br/>
            Textphone: 0300 200 3103 <br/>
            Outside UK: +44 161 210 3086 <br/>
            Monday to Friday, 8am to 6pm <br/>
          </div>
          <br/>
          <span className='govuk-heading-m'>Online</span>
          <a className='govuk-link'>Ask HMRC online</a>

        </div>
        <Button onClick={beginClaim} variant={'start'}>Begin New Claim</Button>
      </div>
    </>)
}
