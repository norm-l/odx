import React from 'react';
import { useTranslation } from 'react-i18next';

export default function StartPage() {
  const { t } = useTranslation();

  const handleSubmit = () => {};

  const generateList = (listTitle: string, list: Array<string>) => {
    return (
      <>
        <p className='govuk-body'>{t(listTitle)}:</p>
        <ul className='govuk-list govuk-list--bullet'>
          {list.map(listItem => (
            <li>{t(listItem)}</li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <main className='govuk-main-wrapper govuk-main-wrapper--l' id='main-content' role='main'>
      <div className='govuk-grid-row'>
        <div className='govuk-grid-column-two-thirds'>
          <form>
            <span className='govuk-caption-xl'>Liz Jones</span>
            <h1 className='govuk-heading-l'>{t('EXTEND_YOUR_CHILD_BENEFIT_PAYMENTS')}</h1>
            {generateList('USE_THIS_FORM', [
              'GCSE_OR_A_LEVELS',
              'BTECS_LEVEL1_2_OR_3',
              'T_LEVELS',
              'NVQS_LEVEL1_2_OR_3',
              'INTERNATIONAL_BACCALAUREATE',
              'SCOTTISH_HIGHERS'
            ])}

            <p className='govuk-body'>
              <a href='https://www.gov.uk/government/publications/child-benefit-child-continuing-in-approved-education-or-training-ch297'>
                {t('IF_THEY_WILL_BE_STUDYING_SOMETHINGELSE')}
              </a>{' '}
              {t('but you need to use a different form.')}
            </p>

            {generateList('THE_YOUNG_PERSON_WILL_NEED_TO_BE', [
              '16_OR_17_ON_1SEPT2023',
              'ON_THEIR_COURSE_FOR_1_OR_2_ACADEMIC_YEARS',
              'STUDYING_FT_MORE_THAN_12HRS_A_WEEK',
              'ON_A_COURSE_PROVIDED_BY_SCHOOL_OR_COLLEGE',
              'LIVING_WITH_YOU_IN_THE_UK'
            ])}

            <p className='govuk-body govuk-!-margin-bottom-7'>
              {t('USE_ANOTHER_FORM_TO_APPLY')}{' '}
              <a href=''>{t('IF_THEIR_CIRCUMSTANCES_WILL_BE_DIFFERENT')}</a>.
            </p>

            <div className='govuk-button-group'>
              <button
                className='govuk-button'
                data-module='govuk-button'
                onClick={handleSubmit}
                type='button'
              >
                {t('CONTINUE')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
