// from react_root.js
import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import TopLevelApp from '../src/samples/TopLevelApp';

const outletElement = document.getElementById("outlet");

if(outletElement){
  try {
  render((
    <BrowserRouter>
      <TopLevelApp />
    </BrowserRouter>
  ), document.getElementById("outlet"));
  } catch (e) {
    render
      (
      <div> There has been a problem : {e}</div>
      , document.getElementById("outlet"));
  }
}
