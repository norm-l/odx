import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import FieldSet from '../FormGroup/FieldSet';
import GDSCheckbox from './Checkbox'

export default function Checkboxes(props) {
  const {
    optionsList,
    onBlur,
    inputProps,
  } = props;


  const checkboxClasses = `govuk-checkboxes`;
  const [optionsListToRender, setOptionsList] = useState(optionsList);
  const [exclusiveOption, setExclusiveOption] = useState<any>({})

  const exclusiveInputProps = {...inputProps, ['data-behaviour']:'exclusive'};


  useEffect(()=>{
    if(optionsList.length !== 0){
      let exclusiveIndex : number;
      let localExclusiveOption : {};
      optionsList.forEach((option, idx) => {
        if(option.label.toLowerCase().includes('none')){
          localExclusiveOption = option;
          exclusiveIndex = idx;
        }
      })
      optionsList.splice(exclusiveIndex, 1);
      setOptionsList(optionsList);
      setExclusiveOption(localExclusiveOption);
    }
  },[])



  return (
    <FieldSet {...props}>
      <div className={checkboxClasses}>
        {optionsListToRender.map((item, index) => (
          <GDSCheckbox
            item={item}
            index={index}
            name={item.name}
            inputProps={...inputProps}
            onChange={item.onChange}
            onBlur={onBlur}
            key={item.name}
          />
        ))}
        <div className="govuk-checkboxes__divider">or</div>
        <GDSCheckbox
          item={exclusiveOption}
          index={optionsListToRender.length}
          name={exclusiveOption.name}
          inputProps={...exclusiveInputProps}
          onChange={exclusiveOption.onChange}
          onBlur={onBlur}
          key={exclusiveOption.name}
        />
      </div>
    </FieldSet>
  );
}

Checkboxes.propTypes = {
  name: PropTypes.string,
  optionsList: PropTypes.arrayOf(PropTypes.shape({
    checked: PropTypes.bool,
    label: PropTypes.string,
    hintText: PropTypes.string,
    readOnly:PropTypes.bool,
    onChange:PropTypes.func})
  ),
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ...FieldSet.propTypes ,
};
