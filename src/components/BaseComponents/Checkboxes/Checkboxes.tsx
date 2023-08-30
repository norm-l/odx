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

  const [noneSelected, setNoneSelected] = useState(false);


  const checkboxClasses = `govuk-checkboxes`;
  // const [optionsListToRender, setOptionsList] = useState(optionsList);
  // const [exclusiveOption, setExclusiveOption] = useState<any>({})

  const exclusiveInputProps = {...inputProps, ['data-behaviour']:'exclusive'};
  const handleExclusiveBehaviour = () => {
    const selectCheckboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('input:not([data-behaviour="exclusive"])');
    const deselectCheckboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('[data-behaviour="exclusive"]');

    console.log(selectCheckboxes, deselectCheckboxes);
    for (const selectedElement of selectCheckboxes) {
        selectedElement.addEventListener('click', () => {
            for (const elementToDeselect of deselectCheckboxes) {
                elementToDeselect.checked = false;
                console.log('deselected');
            }
        }, false);
    }

    for (const selectedElement of deselectCheckboxes) {
        selectedElement.addEventListener('click', () => {
            for (const elementToDeselect of selectCheckboxes) {
                elementToDeselect.checked = false;
                console.log('selected');
            }
        }, false);
    }
  }

  useEffect(()=>{
    handleExclusiveBehaviour();
  },[noneSelected])


  // useEffect(()=>{
  //   if(optionsList.length !== 0){
  //     let exclusiveIndex : number;
  //     let localExclusiveOption : {};
  //     optionsList.forEach((option, idx) => {
  //       if(option.label.toLowerCase().includes('none')){
  //         localExclusiveOption = option;
  //         exclusiveIndex = idx;
  //       }
  //     })
  //     optionsList.splice(exclusiveIndex, 1);
  //     setOptionsList(optionsList);
  //     setExclusiveOption(localExclusiveOption);
  //   }

  //   console.log(optionsListToRender)
  // },[])

  // const handleExclusiveSelector = (onChange) => {
  //   onChange();
  //   optionsList.forEach(option => {
  //     if(option.)
  //   })
  // }



  return (
    <FieldSet {...props}>
      <div className={checkboxClasses}>
      {/* {optionsList.map((item, index) => {
          if(true){
            return (<GDSCheckbox
              item={item}
              index={index}
              name={item.name}
              inputProps={...inputProps}
              onChange={item.onChange}
              onBlur={onBlur}
              key={item.name}
            />)
          }})
        } */}
        {optionsList.map((item, index) => {
          if(index !== optionsList.length-1){
            return (<GDSCheckbox
              item={item}
              index={index}
              name={item.name}
              inputProps={...inputProps}
              onChange={(e)=>{item.onChange(e); setNoneSelected(false);}}
              onBlur={onBlur}
              key={item.name}
            />)
          }})
        }

        <div className="govuk-checkboxes__divider">or</div>
        <GDSCheckbox
          item={optionsList[optionsList.length - 1]}
          index={optionsList.length - 1}
          name={optionsList[optionsList.length - 1].name}
          inputProps={...exclusiveInputProps}
          onChange={(e)=>{optionsList[optionsList.length - 1].onChange(e); setNoneSelected(true);}}
          onBlur={onBlur}
          key={optionsList[optionsList.length - 1].name}
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
