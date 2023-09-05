import React, {useEffect, useState} from 'react';
import DateFormatter from '@pega/react-sdk-components/lib/components/helpers/formatters/Date';
import Button from '../../../components/BaseComponents/Button/Button';
import PropTypes from "prop-types";
import { Utils } from '../../helpers/utils';
import { useTranslation } from 'react-i18next';

declare const PCore: any;

export default function ClaimsList(props){
  const { thePConn, data, title, loading, rowClickAction, buttonContent} = props;
  const { t } = useTranslation();
  // const childrenJSON = Claim.Claim.childrenJSON;
  const [claims, setClaims] = useState([]);

  /* Property Resolver */
  const resolveProperty = (source, propertyName) => {
    if (!propertyName) { return '' };

    if(source[propertyName]){ return source[propertyName]};

    let resolvedProperty = source;
    const propertyNameSplit = propertyName.split('.');
    propertyNameSplit.forEach(property => {
      if(resolvedProperty){
        resolvedProperty = resolvedProperty[property];
      }
    });

    if(resolvedProperty){
      return resolvedProperty;
    }
    return '';

  }

  const statusMapping = (status) => {
    switch(status){
      case 'Open-InProgress':
        return { text: t('IN_PROGRESS'), tagColour: 'grey' };
      case 'Pending-CBS':
      case 'Resolved-Completed':
      case 'Pending-ManualInvestigation':
        return {text: t("CLAIM_RECEIVED"), tagColour:'blue'};
      default:
        return {text:status, tagColour:'grey'};
    }
  }

  function _rowClick(row: any) {
    const {pzInsKey, pyAssignmentID} = row;

    const container = thePConn.getContainerName();
    const target = `${PCore.getConstants().APP.APP}/${container}`;

    if( rowClickAction === 'OpenAssignment'){
      const openAssignmentOptions = { containerName: container};
      PCore.getMashupApi().openAssignment(pyAssignmentID, target, openAssignmentOptions)
      .then(()=>{
        Utils.scrollToTop();
      });
    } else if ( rowClickAction === 'OpenCase'){
      PCore.getMashupApi().openCase(pzInsKey, target, {pageName:'SummaryClaim'})
      .then(()=>{
        Utils.scrollToTop();
      });
    }
  }

  function _setClaims() {
    const claimsData = [];
    data.forEach(item => {
      console.log('data loaded')
      const claimItem = {
        claimRef : item.pyID,
        children : {
          firstName : item.Claim.Child.pyFirstName,
          lastName : item.Claim.Child.pyLastName,
          dob : DateFormatter.Date(item.Claim.Child.DateOfBirth, { format: 'DD MMMM YYYY' })
        },
        actionButton :
          (<Button
            attributes={{className:'govuk-!-margin-top-4 govuk-!-margin-bottom-4'}}
            variant='secondary'
            onClick={() => {
              _rowClick(item);
            }}
          >
            {typeof(buttonContent) === 'function' ? buttonContent(item) : buttonContent}
          </Button>) ,
        status : statusMapping(item.pyStatusWork)
      };
      // if(item.Claim.childrenJSON !== null){
      //   // extract children from this json and add it to the
      //   // item.Claim.childrenJSON.
      // }
      claimsData.push(claimItem);
    })
    setClaims(claimsData);
  }

  useEffect(() => {
    console.log('called it');
    _setClaims();
  },[data, loading])



  return (
    <>
      {claims.length !== 0 && (
        <h2 className='govuk-heading-m'>{title}</h2>
      )}
      {claims.length > 1 && <h3 className='govuk-heading-s'>Children added</h3>}
      {/* <h5>{claims[0].children.firstName}</h5> */}
      {claims.map(claimItem => {
      <dl className='govuk-summary-list'>
        <div className='govuk-summary-list__row'>
          <dt className='govuk-summary-list__key'>
            <a href='#'>{`${claimItem.children.firstName} ${claimItem.children.lastName}`}</a>
            <p className='govuk-!-font-weight-regular'>{claimItem.children.dob}</p>
            {claimItem.actionButton}
          </dt>
          <dd className='govuk-summary-list__value'></dd>
          <dd className='govuk-summary-list__actions govuk-!-width-one-half'>
            <a href='#' className='govuk-link'>
              <strong className='govuk-tag govuk-tag--blue'>{claimItem.status.text}</strong>
            </a>
          </dd>
        </div>
      </dl>
    })}
    </>
  )
}

ClaimsList.propTypes = {
  thePConn: PropTypes.object,
  data: PropTypes.array,
  options: PropTypes.array,
  title: PropTypes.string,
  loading: PropTypes.bool,
  rowClickAction: PropTypes.oneOf(["OpenCase","OpenAssignment"]),
  buttonContent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
}
