import React, { useState, useEffect } from 'react';
// import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
// import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';
// import { isValueInRange } from '@pega/cosmos-react-core/lib/components/Number/utils';
import InstructionComp from '../../../helpers/formatters/ParsedHtml';

// ScalarListProps can't extend PConnFieldProps because its 'value' has a different type
/* interface ScalarListProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  displayInModal: boolean;
  hideLabel: boolean;
  value: Array<any>;
  componentType: string;
  label: string;
  displayMode: string;
} */

/* function CommaSeparatedList(props) {
  const { items } = props;
  return (
    <ul style={{ padding: '0', margin: '0' }}>
      {items.map((value, index) => {
        return <span key={index}>{value}</span>;
      })}
    </ul>
  );
} */

export default function ScalarList(props: any) {
  // Get emitted components from map (so we can get any override that may exist)
  // const FieldValueList = getComponentFromMap('FieldValueList');
  
  const [currentLang, setCurrentLang] = useState(sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'EN',);

  const {
    label,
    getPConnect,
  } = props;

  useEffect(() => {
    const subId = `scalarList_${label}`;
    PCore.getPubSubUtils().subscribe('languageToggleTriggered', ({language}) => {
      setCurrentLang(language.toUpperCase());
    }, subId,)
  }, [])

  /* const items = scalarValues?.map(scalarValue => {
    return getPConnect().createComponent(
      {
        type: componentType,
        config: {
          value: scalarValue,
          displayMode: 'LABELS_LEFT',
          label,
          ...restProps,
          readOnly: 'true'
        }
      },
      '',
      '',
      {}
    ); // 2nd, 3rd, and 4th args empty string/object/null until typedef marked correctly as optional;
  }); */

  const metadata:any = getPConnect().getRawMetadata()
  const languageValues = PCore.getStoreValue(metadata.config.value.split(' ').slice(1).join().split('.').slice(0,-1).join('.'), getPConnect().options.pageReference, 'app/primary_1/workarea_1');
  

  return <InstructionComp  htmlString={languageValues.find((value => value.Language === currentLang.toUpperCase())).Content}/>
  

  /* if (['LABELS_LEFT', 'STACKED_LARGE_VAL', 'DISPLAY_ONLY'].includes(displayMode)) {
    const displayComp = (
      <div>
        <CommaSeparatedList items={items} />
      </div>
    );
    return displayComp;
  }

  const displayComp = <CommaSeparatedList items={items} />;

  return <FieldValueList name={hideLabel ? '' : label} value={displayComp} variant='stacked' />; */
}
