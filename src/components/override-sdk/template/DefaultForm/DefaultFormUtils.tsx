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
  return finalText;
}

function formatter(finalText, stringWithTag, replace) {
  const startOfMarkedSpan = finalText.indexOf(stringWithTag); // e.g. abjhfds*<strong>WARNING!!jkgkjhhlk</strong>abjkk
  const endOfMarkedSpan = finalText.indexOf('</strong>', startOfMarkedSpan) + '</strong>'.length; // e.g. abjhfds<strong>WARNING!!jkgkjhhlk</strong>*abjkk
  const textToReplace = finalText.substring(startOfMarkedSpan, endOfMarkedSpan); // e.g. <strong>WARNING!!jkgkjhhlk</strong>

  const startOfTextToExtract = finalText.indexOf(stringWithTag) + stringWithTag.length + 1; // e.g. abjhfds<strong>WARNING!!*jkgkjhhlk</strong>abjkk
  const endOfTextToExtract = finalText.indexOf('</strong>', startOfTextToExtract); // e.g. abjhfds<strong>WARNING!!jkgkjhhlk*</strong>abjkk
  const textToExtract = finalText.substring(startOfTextToExtract, endOfTextToExtract); // e.g. jkgkjhhlk
  return replace(finalText, textToReplace, textToExtract);
}

export function getFormattedInstructionText(instructionText) {
  let finalText = instructionText.replaceAll('\n<p>&nbsp;</p>\n', '');
  const stringWithTagForWarning = `<strong>WARNING!!`;
  const stringWithTagForInset = `<p>INSET!!`;
  // if the required text exists
  if (finalText.indexOf(stringWithTagForWarning) !== -1) {
    finalText = formatter(finalText, stringWithTagForWarning, replaceWarningText);
  }
  if (finalText.indexOf(stringWithTagForInset) !== -1) {
    finalText = formatter(finalText, stringWithTagForInset, replaceInsetText);
  }

  return finalText;
}

export function settingTargetForAnchorTag() {
  const instructionDiv = document.getElementById('instructions');
  const keyText = 'OPENS_IN_NEW_TAB';
  if (instructionDiv) {
    const elementsArr = instructionDiv.querySelectorAll('a');
    for (const ele of elementsArr) {
      if (ele.innerHTML.includes(keyText)) {
        ele.setAttribute('target', '_blank');
        ele.setAttribute('rel', 'noreferrer noopener');
      }
    }
  }
}
