import React, { createElement } from 'react';

import { getInstructions } from './utils';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import './DefaultForm.css';

import StyledHmrcOdxGdsCheckAnswersPageWrapper from './styles';

interface HmrcOdxGdsCheckAnswersPageProps extends PConnProps {
  // If any, enter additional props that only exist on this componentName
  NumCols?: string;
  instructions?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  children: Array<any>;
}

export default function HmrcOdxGdsCheckAnswersPage(props: HmrcOdxGdsCheckAnswersPageProps) {
  // template structure setup
  const { getPConnect, NumCols = '1' } = props;
  const instructions = getInstructions(getPConnect(), props.instructions);

  let divClass: string;

  const numCols = NumCols || '1';
  switch (numCols) {
    case '1':
      divClass = 'psdk-default-form-one-column';
      break;
    case '2':
      divClass = 'psdk-default-form-two-column';
      break;
    case '3':
      divClass = 'psdk-default-form-three-column';
      break;
    default:
      divClass = 'psdk-default-form-one-column';
      break;
  }

  const arChildren = getPConnect().getChildren()[0].getPConnect().getChildren();
  const dfChildren = arChildren.map((kid, idx) =>
    // eslint-disable-next-line react/no-array-index-key
    // createElement(createPConnectComponent(), { ...kid, key: idx })
    {
      kid.key = idx;
      // @ts-ignore
      return getPConnect().createComponent(kid.getPConnect().getRawMetadata());
    }
  );

  // arReviewItems will contain all the children of the views and nested review to be rendered on the screen
  const arReviewItems = [];

  // arRefs will contain all the pConnect objects of the reference views
  const arRefs = new Map();

  // recrusive function to get all the children of this top level template
  function getAllChildren(pConnect) {
    if (
      pConnect.getPConnect().getComponentName &&
      pConnect.getPConnect().getComponentName() === 'reference'
    ) {
      const viewProps = pConnect
        .getPConnect()
        .resolveConfigProps(pConnect.getPConnect().getConfigProps());

      // if not to be displayed return
      if (viewProps.visibility === false) {
        return;
      }

      const viewPConnect = pConnect.getPConnect().getReferencedViewPConnect();

      arRefs.set(viewPConnect.getPConnect().viewName, pConnect); // store the reference view pConnect object
      getAllChildren(viewPConnect);
    } else if (
      (pConnect.getPConnect().getComponentName &&
        pConnect.getPConnect().getComponentName() === 'View') ||
      (pConnect.getPConnect().getComponentName &&
        pConnect.getPConnect().getComponentName() === 'Region')
    ) {
      pConnect
        .getPConnect()
        .getChildren()
        .forEach(child => getAllChildren(child));
    } else {
      // if not a reference, view or region, then it is a review item
      try {
        arReviewItems.push(pConnect);
      } catch (error) {
        // eslint-disable-next-line no-console, prefer-template
        console.error('Array push error: ', pConnect, error);
      }
    }
  }

  getAllChildren(props);

  // eslint-disable-next-line no-console
  console.log('arRefs: ', arRefs);

  // array to store items which are to be displayed on the screen
  const filteredItems = [];
  // array to store raw config of the items which are to be displayed on the screen
  const arRawConfig = [];
  arReviewItems.forEach(item => {
    // Perform checks on item here to determine if it should be included in the filteredItems array

    // retrieve the associated reference view pConnect object for the review item
    const refPConnect = arRefs.get(item.getPConnect().viewName);

    // create the review item component
    const refComponent = refPConnect
      .getPConnect()
      .createComponent(refPConnect.getPConnect().getRawMetadata());

    item.getPConnect().populateAdditionalProps(item.getPConnect().getConfigProps());

    // set the review item to read only
    const rawConfig = item.getPConnect().getRawMetadata();
    rawConfig.config.readOnly = true;
    rawConfig.config.displayMode = 'DISPLAY_ONLY';

    // resolve the config props
    refPConnect.getPConnect().resolveConfigProps(refPConnect.getPConnect().getConfigProps());

    // get the context of the review item from the containing reference view
    const context = refPConnect.getPConnect().meta.config.context;

    // In the context of the ref view component, create the review item component
    const component = refComponent.props.getPConnect().createComponent(rawConfig, null, null, {
      pageReference: context && context.startsWith('@CLASS') ? '' : context
    });

    // if the review item is not to be displayed, return
    if (component.props.visibility !== undefined && component.props.visibility === false) {
      return;
    }

    // if the review item is a group, create the children items
    if (rawConfig.type === 'Group') {
      const groupChildren = component.props
        .getPConnect()
        .getChildren()
        .map(child =>
          child.getPConnect().createComponent(child.getPConnect().getRawMetadata(), null, null, {
            pageReference: child.getPConnect().getPageReference(),
            context: child.getPConnect().getContextName()
          })
        );

      const el = createElement(
        createPConnectComponent(),
        {
          ...item,
          key: item.key,
          additionalProps: {
            pageReference: item.getPConnect().getPageReference(),
            context: item.getPConnect().getContextName()
          }
        }, // TODO - grab corrct pageReference and context
        groupChildren
      );

      filteredItems.push(el);
    } else {
      // @ts-ignore
      filteredItems.push(component);
    }

    arRawConfig.push(rawConfig);
  });

  // eslint-disable-next-line no-console
  console.log('arRawConfig:', arRawConfig);
  // eslint-disable-next-line no-console
  console.log('filteredItems', filteredItems);
  // eslint-disable-next-line no-console
  // console.log(dfChildren);
  return (
    <StyledHmrcOdxGdsCheckAnswersPageWrapper>
      <>
        {instructions && (
          <div className='psdk-default-form-instruction-text'>
            {/* server performs sanitization method for instructions html content */}
            {/* eslint-disable react/no-danger */}
            <div key='instructions' dangerouslySetInnerHTML={{ __html: instructions }} />
          </div>
        )}
        <div className={divClass}>{dfChildren}</div>
        <dl className='govuk-summary-list govuk-!-margin-bottom-9'>
          {filteredItems.map((item, index) => {
            const idx = index + 1;
            // return <div key={idx}>{item}</div>;
            return (
              <>
                <div className='govuk-summary-list__row' key={idx}>
                  <dt className='govuk-summary-list__key'>{item.props.label}</dt>
                  <dd className='govuk-summary-list__value'>{item.props.value}</dd>
                  {/* <dd className="govuk-summary-list__actions">
              <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> name</span></a>
            </dd> */}
                </div>
              </>
            );
          })}
        </dl>
        {Array.from(arRefs.values()).map((refPConnect, index) => {
          const refComponent = refPConnect
            .getPConnect()
            .createComponent(refPConnect.getPConnect().getRawMetadata());
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index + 1}>
              <h2>{refPConnect.getPConnect().viewName}</h2>
              {refComponent}
            </div>
          );
        })}
      </>
    </StyledHmrcOdxGdsCheckAnswersPageWrapper>
  );
}
