// How to add welsh translation to this file, for Opens in new tab and warning etc.

function replaceWarningText(finalText, textToBeReplaced, textToBeFormatted) {
  const textToBeInserted = `<div class="govuk-warning-text">
          <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong class="govuk-warning-text__text">
            <span class="govuk-warning-text__assistive">WARNING</span>
            ${textToBeFormatted}
          </strong>
        </div>`;

  finalText = finalText.replaceAll(textToBeReplaced, textToBeInserted);
  return finalText;
}

function replaceInsetText(finalText, textToBeReplaced, textToBeFormatted) {
  const textToBeInserted = `<div class="govuk-inset-text">${textToBeFormatted}</div>`;
  finalText = finalText.replaceAll(textToBeReplaced, textToBeInserted);
  console.log(finalText); // eslint-disable-line
  return finalText;
}

function formatter(finalText, stringWithTag, endtag, replace) {
  finalText = finalText.replaceAll('\n<p>&nbsp;</p>\n', '');
  const startOfMarkedSpan = finalText.indexOf(stringWithTag); // e.g. abjhfds*<strong>WARNING!!jkgkjhhlk</strong>abjkk
  const endOfMarkedSpan = finalText.indexOf(endtag, startOfMarkedSpan) + endtag.length; // e.g. abjhfds<strong>WARNING!!jkgkjhhlk</strong>*abjkk
  const textToReplace = finalText.substring(startOfMarkedSpan, endOfMarkedSpan); // e.g. <strong>WARNING!!jkgkjhhlk</strong>
  console.log('textToReplace', textToReplace); // eslint-disable-line

  const startOfTextToExtract = finalText.indexOf(stringWithTag) + stringWithTag.length; // e.g. abjhfds<strong>WARNING!!*jkgkjhhlk</strong>abjkk
  const endOfTextToExtract = finalText.indexOf(endtag, startOfTextToExtract); // e.g. abjhfds<strong>WARNING!!jkgkjhhlk*</strong>abjkk
  const textToExtract = finalText.substring(startOfTextToExtract, endOfTextToExtract); // e.g. jkgkjhhlk
  console.log(textToExtract); // eslint-disable-line
  return replace(finalText, textToReplace, textToExtract);
}

export default function getFormattedInstructionText(finalText) {
  if (finalText === undefined || finalText === '') {
    return null;
  }
  console.log(finalText); // eslint-disable-line
  const stringWithTagForWarning = `<strong>WARNING!!!`;
  const endtagForWarning = '</strong>';
  const stringWithTagForInset = `<p>INSET!!`;
  const endtagForInset = '</p>';
  // if the required text exists
  if (finalText.indexOf(stringWithTagForWarning) !== -1) {
    console.log('going for warning'); // eslint-disable-line
    finalText = formatter(finalText, stringWithTagForWarning, endtagForWarning, replaceWarningText);
  }
  if (finalText.indexOf(stringWithTagForInset) !== -1) {
    console.log('going for inset'); // eslint-disable-line
    finalText = formatter(finalText, stringWithTagForInset, endtagForInset, replaceInsetText);
  }

  return finalText;
}
