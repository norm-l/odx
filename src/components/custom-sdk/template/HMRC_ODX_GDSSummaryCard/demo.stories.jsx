import {
  Input,
  // useTheme,
  DateInput,
  RadioButtonGroup,
  RadioButton
} from '@pega/cosmos-react-core'; // components required for render
import HmrcOdxGdsSummaryCard from './index'; // import the component to test
import { pyReviewRawMetadata, regionChildrenResolved } from './mock.stories'; // inport test data
import { Region } from './utils'; // utility functions - TODO make more generic and widely globally available

// supply Storybook with naming parameters
export default {
  title: 'HmrcOdxGdsSummaryCard',
  component: HmrcOdxGdsSummaryCard
};

const Template = args => {
  const regionAChildren = pyReviewRawMetadata.children[0].children.map(child => {
    return Primary.args.getPConnect().createComponent(child);
  });

  const regionBChildren = pyReviewRawMetadata.children[0].children.map(child => {
    return Primary.args.getPConnect().createComponent(child);
  });

  // children is the child contained within the PizzaPlanetOdxGdsSummaryCard wrapper

  return (
    <HmrcOdxGdsSummaryCard {...args}>
      <Region {...pyReviewRawMetadata.children[0]}>{regionAChildren}</Region>
      <Region {...pyReviewRawMetadata.children[0]}>{regionBChildren}</Region>
    </HmrcOdxGdsSummaryCard>
  );
};

export const Primary = Template.bind({});

// core template as used by Storybook
Primary.args = {
  handleOnClick: () => {
    return false;
  },
  template: 'Review answers template',
  showHighlightedData: true,
  label: 'Review answers',
  sectionHeader: 'Claimant answers',
  useType: '1',
  showLabel: 'true',
  stepId: '1',
  actions: {
    navigateToStep: () => {
      // Return the children array for the mock.
      const navigateToStepPromise = new Promise((resolve) => {
        // Perform asynchronous operation
        // ...
        // Simulate successful response
        resolve('Data');
        // Simulate error response
        // reject(new Error('Error fetching data'));
      });

      return navigateToStepPromise;
    }
  },
  getPConnect: () => {
    return {
      getChildren: () => {
        // Return the children array for the mock.
        return pyReviewRawMetadata.children;
      },
      getRawMetadata: () => {
        // Return the complete mock object.
        return pyReviewRawMetadata;
      },
      getInheritedProps: () => {
        // Obtain the array and perform no operation as this set as this is a mock.
        return pyReviewRawMetadata.config.inheritedProps;
      },
      createComponent: config => {
        // create the desired component from the resolved mock data
        switch (config.config.name) {
          // case '@P .pyStatusWork':
          //   return renderField(pyReviewResolved.highlightedData[0].config);
          // case '@P .pyID':
          //   return renderField(pyReviewResolved.highlightedData[1].config);
          // case '@P .pxCreateDateTime':
          //   return renderField(pyReviewResolved.highlightedData[2].config);
          // case '@USER .pxCreateOperator':
          //   return renderField(pyReviewResolved.highlightedData[3].config);
          // case '@P .pySLADeadline':
          //   return renderField(regionChildrenResolved[0]);
          // case '@P .pySLAGoal':
          //   return renderField(regionChildrenResolved[1]);
          // case '@P .pySLAStartTime':
          //   return renderField(regionChildrenResolved[2]);
          case 'NINumber':
            return renderField(regionChildrenResolved[0]);
          case 'NameDetails':
            return renderField(regionChildrenResolved[1]);
          case 'DateOfBirth':
            return renderField(regionChildrenResolved[2]);
          case 'SubjectToImmigration':
            return renderField(regionChildrenResolved[3]);
          default:
            return '';

          // TODO - need to make more generic. Throws an error if no match
        }
      },
      setInheritedProp: () => {
        // Obtain the array and perform no operation as this set as this is a mock.
      },
      resolveConfigProps: () => {
        // Resolve config props
      }
    };
  }
};

// TODO Make more generic
const renderField = resolvedProps => {
  const {
    type,
    readOnly = false, // is field read only?
    value = '',
    label = '',
    // theme = useTheme()
  } = resolvedProps;

  // const variant = displayMode === 'LABELS_LEFT' ? 'inline' : 'stacked';

  // INPUT
  switch (type) {
    case 'TextInput':
      return <Input label={label} value={value} readOnly={readOnly} />;

    case 'DateTime':
      return <DateInput label={label} value={value} readOnly={readOnly} DateTimeFormat='short' />;

    case 'RadioButtons': // TODO - make dynamic
      return (
        <RadioButtonGroup label={label} value={value}>
          <RadioButton
            label='Yes'
            id='Yes'
            defaultChecked='false'
            additionalInfo={{
              heading: 'Additional Info',
              content: 'You declare you are subject to immigration'
            }}
          />
          <RadioButton
            label='No'
            id='No'
            defaultChecked
            additionalInfo={{
              heading: 'Additional Info',
              content: 'You are not subject to immigration'
            }}
          />
        </RadioButtonGroup>
      );
      default:
        return '';
  }

  // let val = value != '' ? <Input label={label} value={value} readOnly={readOnly} /> : '';

  // if (label === 'Create date/time')
  //   val = <DateTimeDisplay value={value} variant='datetime' format='long' clockFormat={null} />;

  // if (displayAsStatus === true) val = StatusWorkRenderer({ value });

  // if (label === 'Create Operator')
  //   val = (
  //     <Button
  //       variant='link'
  //       style={
  //         label !== null
  //           ? { width: 'max-content', height: theme.components.input.height }
  //           : undefined
  //       }
  //     >
  //       {value.userName}
  //     </Button>
  //   );

  // if (variant === 'inline') {
  //   val = value || <span aria-hidden='true'>&ndash;&ndash;</span>;
  // } else {
  //   val = (
  //     <Text variant='h1' as='span'>
  //       {val}
  //     </Text>
  //   );
  // }

  // return <FieldValueList variant={variant} fields={[{ name: label, value: val }]} />;
  // return <Input label={label} value={value} />;
};


// import { useState } from 'react';
// import PizzaPlanetOdxGdsSummaryCard from './index.tsx';
// import { pyReviewRaw } from './mock.stories';
// import { TextField } from '@material-ui/core';
// import MuiPhoneNumber from 'material-ui-phone-number';
// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import DayjsUtils from '@date-io/dayjs';

// export default {
//   title: 'PizzaPlanetOdxGdsSummaryCard',
//   component: PizzaPlanetOdxGdsSummaryCard
// };

// const renderField = resolvedProps => {
//   const { displayMode, value = '', label = '', onChange} = resolvedProps;

//   const variant = displayMode === 'LABELS_LEFT' ? 'inline' : 'stacked';
//   let val = '';
//   if (label === 'Service Date')
//     val = <MuiPickersUtilsProvider utils={DayjsUtils}><KeyboardDatePicker
//       variant='inline'
//       inputVariant='outlined'
//       placeholder='mm/dd/yyyy'
//       fullWidth
//       format='MM/DD/YYYY'
//       mask='__/__/____'
//       size='small'
//       label={label}
//       value={value || null}
//       onChange={onChange}
//     />
//     </MuiPickersUtilsProvider>


//   if (label === 'Email')
//     val = <TextField type='email' value={value} size='small' variant='outlined' style={{ fontSize: '14px' }} label={label} onChange={onChange}></TextField>;

//   if (label === 'First Name' || label === 'Last Name' || label === 'Middle Name')
//     val = <TextField value={value} size='small' variant='outlined' style={{ fontSize: '14px' }} label={label} onChange={onChange}></TextField>;

//   if (label === 'Phone Number')
//     val = <MuiPhoneNumber value={value} variant='outlined' size='small' style={{ fontSize: '14px' }} defaultCountry='us' label={label} onChange={onChange}></MuiPhoneNumber>;


//   if (variant === 'inline') {
//     val = value || <span aria-hidden='true'>&ndash;&ndash;</span>;
//   }

//   return val;
// };

// export const BasePizzaPlanetOdxGdsSummaryCard = () => {
//   const [firstName, setFirstName] = useState('John');
//   const [middleName, setMiddleName] = useState('');
//   const [lastName, setLastName] = useState('Joe');
//   const [phone, setPhone] = useState('+16397975093');
//   const [serviceDate, setServiceDate] = useState('2023-01-25');
//   const [email, setEmail] = useState('john@doe.com');
//   const regionChildrenResolved = [
//     {
//       readOnly: undefined,
//       value: firstName,
//       label: 'First Name',
//       hasSuggestions: false,
//       onChange: val => {
//         setFirstName(val.target.value);
//       }
//     },
//     {
//       readOnly: undefined,
//       value: middleName,
//       label: 'Middle Name',
//       hasSuggestions: false,
//       onChange: val => {
//         setMiddleName(val.target.value);
//       }
//     },
//     {
//       readOnly: undefined,
//       value: lastName,
//       label: 'Last Name',
//       hasSuggestions: false,
//       onChange: val => {
//         setLastName(val.target.value);
//       }
//     },
//     {
//       readOnly: undefined,
//       value: email,
//       label: 'Email',
//       hasSuggestions: false,
//       onChange: val => {
//         setEmail(val.target.value);
//       }
//     },
//     {
//       readOnly: undefined,
//       value: phone,
//       label: 'Phone Number',
//       datasource: {
//         fields: {
//           value: undefined
//         },
//         source: [
//           {
//             value: '+1'
//           },
//           {
//             value: '+91'
//           },
//           {
//             value: '+48'
//           },
//           {
//             value: '+44'
//           }
//         ]
//       },
//       hasSuggestions: false,
//       onChange: val => {
//         setPhone(val);
//       }
//     },
//     {
//       readOnly: undefined,
//       value: serviceDate,
//       label: 'Service Date',
//       hasSuggestions: false,
//       onChange: date => {
//         const changeValue = date && date.isValid() ? date.toISOString() : null;
//         setServiceDate(changeValue);
//       }

//     }
//   ];
//   const props = {
//     template: 'DefaultForm',
//     getPConnect: () => {
//       return {
//         getChildren: () => {
//           return pyReviewRaw.children;
//         },
//         createComponent: config => {
//           switch (config.config.value) {
//             case '@P .FirstName':
//               return renderField(regionChildrenResolved[0]);
//             case '@P .MiddleName':
//               return renderField(regionChildrenResolved[1]);
//             case '@P .LastName':
//               return renderField(regionChildrenResolved[2]);
//             case '@P .Email':
//               return renderField(regionChildrenResolved[3]);
//             case '@P .PhoneNumber':
//               return renderField(regionChildrenResolved[4]);
//             case '@P .ServiceDate':
//               return renderField(regionChildrenResolved[5]);
//             default:
//               break;
//           }
//         },
//         setInheritedProp: () => {
//           /* nothing */
//         },
//         resolveConfigProps: () => {
//           /* nothing */
//         },
//       };
//     }
//   };

//   const regionAChildren = pyReviewRaw.children[0].children.map(child => {
//     return props.getPConnect().createComponent(child);
//   });

//   return (
//     <>
//       <PizzaPlanetOdxGdsSummaryCard {...props}>
//         {regionAChildren}
//       </PizzaPlanetOdxGdsSummaryCard>
//     </>
//   );
// };




// import { useState } from 'react';
// import HmrcOdxGdsSummaryCard from './index.tsx';
// import { pyReviewRaw } from './mock.stories';
// import { TextField } from '@material-ui/core';
// import MuiPhoneNumber from 'material-ui-phone-number';
// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import DayjsUtils from '@date-io/dayjs';

// export default {
//   title: 'HmrcOdxGdsSummaryCard',
//   component: HmrcOdxGdsSummaryCard
// };
// const renderField = resolvedProps => {
//   const { displayMode, value = '', label = '', onChange} = resolvedProps;

//   const variant = displayMode === 'LABELS_LEFT' ? 'inline' : 'stacked';
//   let val = '';
//   if (label === 'Service Date')
//     val = <MuiPickersUtilsProvider utils={DayjsUtils}><KeyboardDatePicker
//       variant='inline'
//       inputVariant='outlined'
//       placeholder='mm/dd/yyyy'
//       fullWidth
//       format='MM/DD/YYYY'
//       mask='__/__/____'
//       size='small'
//       label={label}
//       value={value || null}
//       onChange={onChange}
//     />
//     </MuiPickersUtilsProvider>


 
//   if (label === 'First Name' || label ==='Date Of Birth')
//   {
//     val = <TextField value={value} size='small' variant='outlined' style={{ fontSize: '14px' }} label={label} onChange={onChange}></TextField>;
//   }

//   if (variant === 'inline') {
//     val = value || <span aria-hidden='true'>&ndash;&ndash;</span>;
//   }

//   return val;
// };
 
// export const BaseHmrcOdxGdsSummaryCard = () => {
//   const [firstName, setFirstName] = useState('John');

//   const [dateOfBirth, setBirthDate] = useState('2023-01-25');

//   const regionChildrenResolved = [
//     {
//       readOnly: undefined,
//       value: firstName,
//       label: 'First Name',
//       hasSuggestions: false,
//       onChange: val => {
//         setFirstName(val.target.value);
//       }
//     },
 
 
//      {
//       readOnly: undefined,
//       value: dateOfBirth,
//       label: 'Date Of Birth',
//       hasSuggestions: false,
//       onChange: date => {
//         const changeValue = date && date.isValid() ? date.toISOString() : null;
//         setBirthDate(changeValue);
//       }

//     }
//   ];
//   const props = {
//     template: 'DefaultForm',
//     useType: "1",
//     getPConnect: () => {
//       return {
//         getChildren: () => {
//           return pyReviewRaw.children;
//         },
       
//         getRawMetadata: () => {
//           return pyReviewRaw;
//         },
//         getInheritedProps: () => {
//           return pyReviewRaw.config.inheritedProps;
//         },
//         setInheritedProp: () => {
//           /* nothing */
//         },
//         resolveConfigProps: () => {
//           /* nothing */
//         },
//         createComponent: config => {
//           switch (config.config.value) {
//             case '@P .FirstName':
//               return renderField(regionChildrenResolved[0]);
           
           
//             case '@P .DateOfBirth':
//               return renderField(regionChildrenResolved[1]);
            
//             default:
//               break;
//           }
//         }
//       };
//     }
//   };


//   const regionAChildren = pyReviewRaw.children[0].children.map(child => {
//     return props.getPConnect().createComponent(child);
//   });


//   return (
//     <>
//       <HmrcOdxGdsSummaryCard {...props}>
//          {regionAChildren} 
      
//       </HmrcOdxGdsSummaryCard>
//     </>
//   );
// };
