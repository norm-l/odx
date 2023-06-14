import React from 'react';
import DateFormatter from '../../../helpers/formatters/Date';

declare const PCore: any;

export default function ClaimsList(props){
  const { thePConn, data, options, title, loading } = props;

  function isSubmittedClaim(){
    return title==='Submitted claim';
  }

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
        return {text:'In Progress', tagColour:'grey'};
      case 'Pending-CBS':
        return {text:'Claim Received', tagColour:'blue'};
      case 'Resolved-Completed':
        return {text:'Completed', tagColour:''};
      default:
        return {text:status, tagColour:'grey'};
    }
  }


  function _rowClick(row: any) {
    const {pzInsKey} = row;

    const container = thePConn.getContainerName();
    const target = `root/${container}`;


    if(isSubmittedClaim()){
      PCore.getMashupApi().openCase(pzInsKey, target, {pageName:'SummaryClaim'});

    }
    else {
      const openAssignmentOptions = { containerName: container};
      PCore.getMashupApi().openAssignment(pzInsKey, target, openAssignmentOptions);
    }
  }


  return (
    <>
    <table className='govuk-summary-list'>
      <caption className="govuk-table__caption govuk-table__caption--m">{title}</caption>
      <tbody>

      {loading && <h2 className='govuk-heading-m' aria-live="polite" role="status">Checking for claims...</h2>}
      {!loading &&
      data.length > 0 ?
      data.map(row => {
        return (
          <tr className='govuk-summary-list__row' key={row.pyID}>
            <td className='govuk-summary-card__content'>
              <div className='govuk-card govuk-grid-row'>
                <div className='govuk-grid-column-two-thirds govuk-!-padding-0'>
                  {options.map(field => {
                    const value = resolveProperty(row, field.name);
                    // Handle Name concatenation
                    if (field.name.includes('FirstName')) {
                      let response = value;

                      const lastNameResults = options.filter(_field =>
                        _field.name.includes('LastName')
                      );
                      if (lastNameResults.length > 0) {
                        const lastName = resolveProperty(row, lastNameResults[0].name);
                        response = response.concat(` ${lastName}`);
                      }
                      return (
                          <div className='govuk-heading-m' key={field.name}>
                            <a>{response}</a>
                          </div>
                      );

                    }
                    // All other fields except for case status
                    if (
                      field.name !== 'pyStatusWork' &&
                      !field.name.includes('FirstName') &&
                      !field.name.includes('LastName')
                    ) {
                      if (field.type === 'Date') {
                        return <div key={field.name}>{DateFormatter.Date(value, { format: 'DD MMMM YYYY' })}</div>;
                      } else {
                        return <div key={field.name}>{value}</div>;
                      }
                    }
                    return null;
                  })}
                  <button
                    className='govuk-button govuk-button--secondary'
                    data-module='govuk-button'
                    type='button'
                    onClick={() => {
                      _rowClick(row);
                    }}
                  >
                    { isSubmittedClaim() ? <>View claim</> : <>Continue claim <span className="govuk-visually-hidden"> for {}</span></>}
                  </button>
                </div>
                <div className='govuk-grid-column-one-third govuk-!-padding-0'>
                  {/* Displays Case status */}
                  <strong
                    className={`govuk-tag govuk-tag--${statusMapping(row.pyStatusWork).tagColour}`}
                  >
                    {statusMapping(row.pyStatusWork).text}
                  </strong>
                </div>
              </div>
            </td>
          </tr>
        );
      }) : <tr className="govuk-table__row">
              <td>
                No {title.toLowerCase()}
              </td>
            </tr>
      }
      </tbody>
    </table>
    </>
  )

}
