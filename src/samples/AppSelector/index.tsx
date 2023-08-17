import React from "react";
import { Switch, Route } from 'react-router-dom';
// import EmbeddedTopLevel from "../Embedded/EmbeddedTopLevel";
import ChildBenefitsClaim from '../ChildBenefitsClaim/index';
import CookiePage from '../ChildBenefitsClaim/CookiePage';

const baseURL = "/";

const AppSelector = () => {

  return (
    <>
      <Switch>
        <Route exact path={baseURL} component={ChildBenefitsClaim} />
        <Route path="/cookies" component={CookiePage} />
        <Route path="*" component={ChildBenefitsClaim} />
      </Switch>
    </>
  )

};

export default AppSelector;
