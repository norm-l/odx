// from react_root.js
import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import TopLevelApp from './applications/TopLevelApp';
import './i18n/i18n';
import LanguageToggle from './components/LanguageToggle';

const outletElement = document.getElementById("outlet");

if (outletElement) {
  const root = createRoot(outletElement);
  root.render(
    <>
    <LanguageToggle />
    <BrowserRouter>
      <TopLevelApp />
      </BrowserRouter>
    </>
  );
}
