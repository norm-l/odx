import React from 'react';

const HMRCAppContext = React.createContext({
  singleQuestionPage: false,
  setAssignmentSingleQuestionPage : (a:any) => {},
  DFCounter: [],
  DFCounterIncrement: (a:any) => {},
});

const DefaultFormContext = React.createContext({
  displayAsSingleQuestion: false,
  DFName: -1
});


export { HMRCAppContext, DefaultFormContext };
