import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ChildBenefitsClaim from '../ChildBenefitsClaim/index';
import CookiePage from '../ChildBenefitsClaim/cookiePage/index';
import Accessibility from '../ChildBenefitsClaim/AccessibilityPage';
import UnAuthChildBenefitsClaim from '../UnAuthChildBenefitsClaim';
import HighIncomeCase from '../HighIncomeCase';
import AreYouSureToContinueWithoutSignIn from '../StaticPages/AreYouSureToContinueWithoutSignIn/AreYouSureToContinueWithoutSignIn';
import DoYouWantToSignIn from '../StaticPages/DoYouWantToSignIn/doYouWantToSignIn';
import CheckOnClaim from '../StaticPages/CheckOnClaim';
import RecentlyClaimedChildBenefit from '../StaticPages/ChooseClaimService';
import EducationStart from '../EducationStart';
import ChildBenefitHub from '../ChildBenefitHub/ChildBenefitHub';
import ProofOfEntitlement from '../ProofOfEntitlement/ProofOfEntitlement';
import ChangeOfBank from '../ChangeOfBank/ChangeOfBank';
import LanguageContextProvider from '../../context/LangauageContext';

const AppSelector = () => {
  return (
    <LanguageContextProvider>
      <Switch>
        <Route exact path='/' component={ChildBenefitsClaim} />
        <Route exact path='/ua' component={UnAuthChildBenefitsClaim} />

        <Route exact path='/home' component={ChildBenefitHub} />
        <Route exact path='/view-proof-entitlement' component={ProofOfEntitlement} />
        <Route exact path='/change-of-bank' component={ChangeOfBank} />

        <Route exact path='/hicbc/opt-in' component={HighIncomeCase} />
        <Route exact path='/education/start' component={EducationStart} />
        <Route path='/cookies' component={CookiePage} />
        <Route path='/accessibility' component={Accessibility} />
        <Route
          path='/are-you-sure-to-continue-without-sign-in'
          component={AreYouSureToContinueWithoutSignIn}
        />
        <Route path='/sign-in-to-government-gateway' component={DoYouWantToSignIn} />
        <Route path='/check-on-claim' component={CheckOnClaim} />
        <Route path='/recently-claimed-child-benefit' component={RecentlyClaimedChildBenefit} />
      </Switch>
    </LanguageContextProvider>
  );
};

export default AppSelector;
