import React, { useState, useEffect } from 'react';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import Button from '../../../components/BaseComponents/Button/Button';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';
import RadioButtons from '../../../components/BaseComponents/RadioButtons/RadioButtons';
import '../../../../assets/css/appStyles.scss';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StaticPageErrorSummary from '../ErrorSummary';
import setPageTitle from '../../../components/helpers/setPageTitleHelpers';
import useTranslatedStaticPageError from '../../../components/helpers/hooks/useTranslatedStaticPageError';

export default function DoYouWantToSignIn() {
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation();
  const history = useHistory();
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const translatedError = useTranslatedStaticPageError(
    'SELECT_YES_IF_YOU_WANT_TO_SIGN_IN',
    lang,
    errorMsg
  );

  useEffect(() => {
    const setPageTitleInterval = setInterval(() => {
      clearInterval(setPageTitleInterval);
      if (errorMsg.length > 0) {
        setPageTitle(true);
      } else {
        setPageTitle();
      }
    }, 500);
  }, [errorMsg, lang]);

  const radioOptions = [
    {
      value: 'yes',
      label: `${t('YES')} ${t('OPENS_IN_NEW_TAB')}`
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
        window.open('/');
      } else {
        history.push('/are-you-sure-to-continue-without-sign-in');
      }
    } else {
      setErrorMsg(t('SELECT_YES_IF_YOU_WANT_TO_SIGN_IN'));
    }
  }

  const hintText = `<p class="govuk-body">${t('YOU_CAN_CREATE_A_PERSONAL_GOVT')}.</p>
  <p class="govuk-body">${t('WHEN_YOU_SIGN_IN_YOU_CAN')}:</p>
  <ul class="govuk-list govuk-list--bullet">
    <li>${t('RECIEVE_YOUR_CHB_PAYMENT_SOONER')}</li>
    <li>${t('SAVE_PROGRESS_AND_RETURN_TO_IT_LATER')}</li>
    <li>${t('COMPLETE_THE_CHB_APPLICATION_FORM_QUICKLY')}</li>
    <li>${t('RECEIVE_TEXT_MESSAGE_UPDATES')}</li>
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
          <StaticPageErrorSummary errorSummary={translatedError} linkHref='#doYouWantToSignIn' />
          <form>
            <RadioButtons
              name='doYouWantToSignIn'
              displayInline
              value=''
              useSmallRadios
              options={radioOptions}
              hintText={hintText}
              legendIsHeading
              errorText={translatedError}
              label={t('DO_YOU_WANT_TO_SIGN_IN')}
            ></RadioButtons>
            <button
              className='govuk-button'
              data-module='govuk-button'
              onClick={handleSubmit}
              type='button'
            >
              {t('CONTINUE')}
            </button>
          </form>
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
}
