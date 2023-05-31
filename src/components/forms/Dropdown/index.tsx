import React, { useEffect, useState } from 'react';

import Utils from '../../../helpers/utils';
import handleEvent from '../../../helpers/event-utils';
import Select from '../../BaseComponents/Select/Select';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyDisplay from '../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay'

interface IOption {
  key: string;
  value: string;
}

export default function Dropdown(props) {
  const {
    getPConnect,
    placeholder,
    value = '',
    datasource = [],
    validatemessage,
    helperText,
    label,
    readOnly,
    name
  } = props;

  const [options, setOptions] = useState<Array<IOption>>([]);
  const [displayValue, setDisplayValue] = useState();


  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const hidePageLabel = useIsOnlyField(thePConn);

  const propName = thePConn.getStateProps().value;

  useEffect(() => {
    const optionsList = [...Utils.getOptionList(props, getPConnect().getDataObject())];
    const selectedOption = optionsList.find(option => option.key === value);
    if(selectedOption && selectedOption.value){
      setDisplayValue(selectedOption.value);
    }
    setOptions(optionsList);
  }, [datasource, value]);

  const handleChange = evt => {
    const selectedValue = evt.target.value === placeholder ? '' : evt.target.value;
    handleEvent(actionsApi, 'changeNblur', propName, selectedValue);
  };

  if(readOnly){
    return <ReadOnlyDisplay label={label} value={displayValue} />
  }

  return (
    <>
      <Select
        label={label}
        hintText={helperText}
        errorText={validatemessage}
        labelIsHeading={hidePageLabel}
        onChange={handleChange}
        value={value}
        name={name}
      >
        <option key={placeholder} value=''>
          {placeholder}
        </option>
        {options.map(option => {
          return (
            <option key={option.key} value={option.key}>
              {option.value}
            </option>
          );
        })}
      </Select>
    </>
  );
}
