import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/BaseComponents/Button/Button';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import AppContextEducation from './reuseables/AppContextEducation'; // TODO: Once this code exposed to common folder, we will remove this import from EducationStart
import WarningText from './reuseables/WarningText';
import BulletListSection from './reuseables/BulletListSection';

export default function LandingPage(props) {
  const { onProceedHandler } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { serviceParam } = useContext(AppContextEducation);

  const bulletSections = [
    {
      titleKey: 'EDUCATION_START_P1',
      bulletPoints: [
        'COURCES_1',
        'COURCES_2',
        'COURCES_3',
        'COURCES_4',
        'COURCES_5',
        'COURCES_6',
        'COURCES_7'
      ]
    },
    {
      titleKey: 'EDUCATION_START_P2',
      bulletPoints: ['ELIGIBILITY_1', 'ELIGIBILITY_2', 'ELIGIBILITY_3', 'ELIGIBILITY_4']
    }
  ];

  return (
    <>
      <Button
        variant='backlink'
        onClick={() => history.goBack()} // Todo: this will be removed with portal story implementation
        key='StartPageBacklink'
        attributes={{ type: 'link' }}
      />
      <MainWrapper serviceParam={serviceParam}>
        <h1 className='govuk-heading-l'>{t('EDUCATION_START_H1')}</h1>

        {bulletSections.map((section) => (
          // Generate a unique key using titleKey and a unique identifier from bulletPoints
          <BulletListSection
            key={`${section.titleKey}-${section.bulletPoints[0]}`} 
            titleKey={section.titleKey}
            bulletPoints={section.bulletPoints}
          />
        ))}

        <p className='govuk-body'>{t('EDUCATION_START_P3')}</p>
        <p className='govuk-body'>{t('EDUCATION_START_P4')}</p>
        <WarningText className='govuk-body'>
          {t('EDUCATION_START_UNIVERSAL_CREDIT_WARNING')}
        </WarningText>

        <Button id='continueToOptin' onClick={onProceedHandler} variant='start'>
          {t('START_NOW')}
        </Button>
        <br />
      </MainWrapper>
    </>
  );
}
