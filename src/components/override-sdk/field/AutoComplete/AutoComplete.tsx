import React, { useContext, useEffect, useState } from 'react';
import GDSAutocomplete from '../../../BaseComponents/Autocomplete/Autocomplete';
import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';
import isDeepEqual from 'fast-deep-equal/react';
import { getDataPage } from '@pega/react-sdk-components/lib/components/helpers/data_page';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import FieldValueList from '@pega/react-sdk-components/lib/components/designSystemExtension/FieldValueList';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import GDSCheckAnswers from '../../../BaseComponents/CheckAnswer/index';
import { ReadOnlyDefaultFormContext } from '../../../helpers/HMRCAppContext';
import { checkStatus } from '../../../helpers/utils';

interface IOption {
  key: string;
  value: string;
}

const preProcessColumns = columnList => {
  return columnList.map(col => {
    const tempColObj = { ...col };
    tempColObj.value = col.value && col.value.startsWith('.') ? col.value.substring(1) : col.value;
    return tempColObj;
  });
};

const getDisplayFieldsMetaData = columnList => {
  const displayColumns = columnList.filter(col => col.display === 'true');
  const metaDataObj: any = { key: '', primary: '', secondary: [] };
  const keyCol = columnList.filter(col => col.key === 'true');
  metaDataObj.key = keyCol.length > 0 ? keyCol[0].value : 'auto';
  for (let index = 0; index < displayColumns.length; index += 1) {
    if (displayColumns[index].primary === 'true') {
      metaDataObj.primary = displayColumns[index].value;
    } else {
      metaDataObj.secondary.push(displayColumns[index].value);
    }
  }
  return metaDataObj;
};

interface AutoCompleteProps extends PConnFieldProps {
  // If any, enter additional props that only exist on AutoComplete here'
  displayMode?: string;
  deferDatasource?: boolean;
  datasourceMetadata?: any;
  listType: string;
  parameters?: any;
  datasource: any;
  columns: Array<any>;
  instructionText: string;
  helperText: string;
  value: string;
  displayOrder: string;
  hideLabel: boolean;
  name: string;
  configAlternateDesignSystem: any;
}

export default function AutoComplete(props: AutoCompleteProps) {
  const {
    getPConnect,
    value = '',
    readOnly,
    testId,
    displayMode,
    deferDatasource,
    datasourceMetadata,
    instructionText,
    validatemessage,
    helperText,
    hideLabel,
    displayOrder,
    configAlternateDesignSystem,
    name,
    placeholder
  } = props;
  const { hasBeenWrapped } = useContext(ReadOnlyDefaultFormContext);
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const [errorMessage, setErrorMessage] = useState(localizedVal(validatemessage));
  const [isAutocompleteLoaded, setAutocompleteLoaded] = useState(false);
  const context = getPConnect().getContextName();
  let { listType, parameters, datasource = [], columns = [], label } = props;

  const { isOnlyField, overrideLabel } = useIsOnlyField(displayOrder);
  if (isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;
  const [options, setOptions] = useState<Array<IOption>>([]);
  const [theDatasource, setDatasource] = useState(null);
  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps()['value'];
  const formattedPropertyName = name || propName?.split('.')?.pop();
  const caseId = thePConn.getCaseSummary().content.pyID;

  function customAssignmentFinished() {
    if (sessionStorage.getItem(`autocompleteValue${name}${caseId}`) !== null) {
      sessionStorage.setItem(
        `autocompleteEmptyValue${name}${caseId}`,
        sessionStorage.getItem(`autocompleteValue${name}${caseId}` || '')
      );
    }
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'assets/lib/location-autocomplete.min.js';
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      setAutocompleteLoaded(true);
    };

    PCore.getPubSubUtils().subscribe(
      'CustomAssignmentFinished',
      customAssignmentFinished,
      'customAssignmentFinished'
    );

    return () => {
      document.body.removeChild(script);
      sessionStorage.setItem('isAutocompleteRendered', 'false');
    };
  }, []);

  useEffect(() => {
    if (!value) {
      sessionStorage.removeItem(`autocompleteEmptyValue${name}${caseId}`);
    }
  }, [value]);

  useEffect(() => {
    setErrorMessage(localizedVal(validatemessage));
  }, [validatemessage]);
  if (!isDeepEqual(datasource, theDatasource)) {
    // inbound datasource is different, so update theDatasource (to trigger useEffect)
    setDatasource(datasource);
  }

  const flattenParameters = (params = {}) => {
    const flatParams = {};
    Object.keys(params).forEach(key => {
      // eslint-disable-next-line
      const { name, value: theVal } = params[key];
      flatParams[name] = theVal;
    });

    return flatParams;
  };

  // convert associated to datapage listtype and transform props
  // Process deferDatasource when datapage name is present. WHhen tableType is promptList / localList
  if (deferDatasource && datasourceMetadata?.datasource?.name) {
    listType = 'datapage';
    datasource = datasourceMetadata.datasource.name;
    parameters = flattenParameters(datasourceMetadata?.datasource?.parameters);
    const displayProp = datasourceMetadata.datasource.propertyForDisplayText.startsWith('@P')
      ? datasourceMetadata.datasource.propertyForDisplayText.substring(3)
      : datasourceMetadata.datasource.propertyForDisplayText;
    const valueProp = datasourceMetadata.datasource.propertyForValue.startsWith('@P')
      ? datasourceMetadata.datasource.propertyForValue.substring(3)
      : datasourceMetadata.datasource.propertyForValue;
    columns = [
      {
        key: 'true',
        setProperty: 'Associated property',
        value: valueProp
      },
      {
        display: 'true',
        primary: 'true',
        useForSearch: true,
        value: displayProp
      }
    ];
  }
  columns = preProcessColumns(columns);

  useEffect(() => {
    if (listType === 'associated') {
      setOptions(Utils.getOptionList(props, getPConnect().getDataObject('')));
    }
  }, [theDatasource]);

  const [currentLang, setCurrentLang] = useState(
    sessionStorage.getItem('rsdk_locale')?.substring(0, 2).toUpperCase() || 'EN'
  );

  PCore.getPubSubUtils().subscribe(
    'languageToggleTriggered',
    ({ language }) => {
      setCurrentLang(language.toUpperCase());
    },
    ''
  );

  useEffect(() => {   
    if (!displayMode && listType !== 'associated') {
      getDataPage(datasource, parameters, context).then((results: any) => {
        const optionsData: Array<any> = [];
        const displayColumn = getDisplayFieldsMetaData(columns);
        const translationDataPage = `@BASECLASS!DATAPAGE!${datasource.toUpperCase()}`;
        const localePath = datasource === 'D_NationalityList' ? 'Value' : 'CountryName';

        results?.forEach(element => {
          const val = element[displayColumn.primary]?.toString();
          const valTranslated = PCore.getLocaleUtils().getLocaleValue(
            val,
            localePath,
            translationDataPage
          );
          const obj = {
            key: element[displayColumn.key] || element.pyGUID,
            value: valTranslated
          };
          optionsData.push(obj);
        });

        setOptions(optionsData);
      });
    }
  }, [currentLang]);

  function handleChange(event) {
    sessionStorage.setItem(`autocompleteValue${name}${caseId}`, event.target.value || '');
    const optionValue = event.target.value;

    const selectedOptionKey = options.filter(item => {
      return item.value === optionValue;
    });
    const selectedKey = selectedOptionKey[0]?.key || '';
    handleEvent(actionsApi, 'changeNblur', propName, selectedKey);
  }

  function stopPropagation(event: MouseEvent, elementUl: HTMLInputElement) {
    if (event.offsetX > elementUl.clientWidth) {
      event.preventDefault();
    }
  }
  const keyHandler = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };
  const selectedOption = options?.filter(item => {
    return item?.key === value;
  });

  useEffect(() => {
    const element = document.getElementById(formattedPropertyName) as HTMLInputElement;
    const elementUl = document.getElementById(
      `${formattedPropertyName}__listbox`
    ) as HTMLInputElement;

    if (validatemessage) {
      element?.classList.add('govuk-input--error');
    }
    element?.addEventListener('blur', handleChange);
    element?.addEventListener('keypress', keyHandler);
    elementUl?.addEventListener('mousedown', event => stopPropagation(event, elementUl));
    return () => {
      window.removeEventListener('blur', handleChange);
      window.removeEventListener('mousedown', handleChange);
    };
  });

  if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  const inprogressStatus = checkStatus();

  if (
    hasBeenWrapped &&
    configAlternateDesignSystem?.ShowChangeLink &&
    inprogressStatus === 'Open-InProgress'
  ) {
    return (
      <GDSCheckAnswers
        label={props.label}
        value={selectedOption[0]?.value}
        name={name}
        stepId={configAlternateDesignSystem.stepId}
        hiddenText={configAlternateDesignSystem.hiddenText}
        getPConnect={getPConnect}
        required={false}
        disabled={false}
        validatemessage=''
        onChange={undefined}
        readOnly={false}
        testId=''
        helperText={helperText}
        placeholder={placeholder}
        hideLabel={false}
        emptyValue={sessionStorage.getItem(`autocompleteEmptyValue${name}${caseId}`)}
      />
    );
  }

  if (readOnly) {
    return (
      selectedOption?.length > 0 && (
        <ReadOnlyDisplay label={label} value={selectedOption[0]?.value} name={name} />
      )
    );
  }

  return (
    isAutocompleteLoaded && (
      <GDSAutocomplete
        label={label}
        optionList={options}
        selectedValue={value}
        instructionText={instructionText}
        helperText={helperText}
        testId={testId}
        labelIsHeading={isOnlyField}
        errorText={errorMessage}
        id={formattedPropertyName}
      />
    )
  );
}
