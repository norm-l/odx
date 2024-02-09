import React, { useState } from 'react';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import Button from '../../../components/BaseComponents/Button/Button';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';
import RadioButtons from '../../../components/BaseComponents/RadioButtons/RadioButtons';
import '../../../../assets/css/appStyles.scss';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InstructionTextComponent from '../../../components/override-sdk/template/DefaultForm/InstructionTextComponent';
import StaticPageErrorSummary from '../ErrorSummary';

export default function DoYouWantToSignIn() {
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation();
  const history = useHistory();
  const radioOptions = [
    {
      value: 'yes',
      label: t('YES')
    },
    {
      value: 'no',
      label: t('NO')
    }
  ];

  function handleSubmit() {
    const selectedOption = document.querySelector('input[name="doYouWantToSignIn"]:checked');
    if (selectedOption) {
      const selectedOptionValue = selectedOption.getAttribute('value');
      if (selectedOptionValue === 'yes') {
        window.location.href = 'https://www.access.service.gov.uk/login/signin/creds';
      } else {
        history.push('/are-you-sure-to-continue-without-sign-in');
      }
    } else {
      setErrorMsg(t('SELECT_YES_IF_YOU_WANT_TO_SIGN_IN'));
    }
  }

  const instructionText = `<p class="govuk-body">${t('YOU_CAN_CREATE_A_PERSONAL_GOVT')}.</p>
  <p class="govuk-body">${t('WHEN_YOU_SIGN_IN_YOU_CAN')}:</p>
  <ul class="list-inside">
    <li class="govuk-body">${t('RECIEVE_YOUR_CHB_PAYMENT_SOONER')}</li>
    <li class="govuk-body">${t('SAVE_PROGRESS_AND_RETURN_TO_IT_LATER')}</li>
    <li class="govuk-body">${t('COMPLETE_THE_CHB_APPLICATION_FORM_QUICKLY')}</li>
    <li class="govuk-body">${t('RECEIVE_TEXT_MESSAGE_UPDATES')}</li>
  </ul>`;
  return (
    <>
      <AppHeader appname={t('CLAIM_CHILD_BENEFIT')} hasLanguageToggle isPegaApp={false} />
      <div className='govuk-width-container'>
        <Button
          variant='backlink'
          onClick={() => history.goBack()}
          key='doYouWantToSignInBackLink'
          attributes={{ type: 'link' }}
        />
        <MainWrapper>
          <StaticPageErrorSummary errorSummary={errorMsg} linkHref='#doYouWantToSignIn' />
          <h1 className='govuk-label govuk-label--l'>{t('DO_YOU_WANT_TO_SIGN_IN')}</h1>
          <InstructionTextComponent instructionText={instructionText} />
          <RadioButtons
            name='doYouWantToSignIn'
            displayInline
            value=''
            useSmallRadios
            options={radioOptions}
            legendIsHeading
            errorText={errorMsg}
          ></RadioButtons>
          <button
            className='govuk-button'
            data-module='govuk-button'
            onClick={handleSubmit}
            type='button'
          >
            {t('CONTINUE')}
          </button>
          <br />
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
}
