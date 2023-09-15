import React from 'react';

const HMRCAppContext = React.createContext({
  singleQuestionPage: false,
  setAssignmentSingleQuestionPage : (a:any) => {},
});

const DefaultFormContext = React.createContext({
  displayAsSingleQuestion: false,
});


export { HMRCAppContext, DefaultFormContext };
