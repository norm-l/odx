import React, {useState, useEffect} from 'react'
import CheckBoxes from '../../BaseComponents/Checkboxes/Checkboxes';
import handleEvent from '../../../helpers/event-utils';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyDisplay from '../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';

export default function Group(props){
  const { children, name, heading, instructions, readOnly, getPConnect } = props;

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const [stateChanged, setStateChanged] = useState(false);

  const isOnlyField = useIsOnlyField();

  // Doesn't seem that state change on children (checkboxes) causes refresh on the containing group,
  // working around with this for now
  useEffect(()=>{
    if (stateChanged) {
      setStateChanged(false);
    }
  }, [stateChanged]);

  if(children.length > 0){
    const handleChange = (event, propName) => {
      console.log('cally wally group');
      handleEvent(actionsApi, 'changeNblur', propName, event.target.checked);
      setStateChanged(true);
    };

    const errors = [""];
    if(children[0].props?.getPConnect().getMetadata().type === 'Checkbox'){

      if(readOnly){
        const valuesList = children.filter( (child) => {
          const childPConnect = child.props.getPConnect();
          const resolvedProps = childPConnect.resolveConfigProps(childPConnect.getConfigProps())
          return (resolvedProps.value);
        }).map((child) => {
            const childPConnect = child.props.getPConnect();
            const resolvedProps = childPConnect.resolveConfigProps(childPConnect.getConfigProps())
            return (resolvedProps.caption);
          }
        )
        return (<ReadOnlyDisplay value={valuesList} label={heading}/>)
      }


      const optionsList = children.map( child => {
        const childPConnect = child.props.getPConnect();
        const resolvedProps = childPConnect.resolveConfigProps(childPConnect.getConfigProps())
        childPConnect.populateAdditionalProps(childPConnect.getConfigProps());
        errors.push(childPConnect.getStateProps().validatemessage)

        // Points error summary link to first checkbox in group
        childPConnect.setStateProps({fieldId: `${name}`});

        return {
            checked: resolvedProps.value,
            label: resolvedProps.caption,
            hintText: " ",
            readOnly: resolvedProps.readOnly,
            onChange: event => handleChange(event, childPConnect.getStateProps().value),
        }
      })
      return (<>
        <CheckBoxes
        optionsList={optionsList}
        name={name}
        onChange={handleChange}
        label={heading}
        instructionText={instructions}
        legendIsHeading={isOnlyField}
        errorText={errors.join(' ').trim() !== '' ? errors.join(' ').trim() : null}
        />
      </>);
    }
  }

  return (<>
  {...children}
  </>);
}


Group.propTypes = {
}
