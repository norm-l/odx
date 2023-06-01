import React from 'react';
import DateFormatter from '../../../helpers/formatters/Date';

export default function ClaimsList(props){

  const {data, options, title} = props;
  const arRows = [];

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

  []
  const statusMapping = (status) => {
    switch(status){
      case 'Open-InProgress':
        return {text:'Incomplete', tagColour:'grey'};
      case 'Pending-CBS':
        return {text:'Claim Received', tagColour:'blue'};
      case 'Resolved-Completed':
        return {text:'Completed', tagColour:''};
      default:
        return {text:status, tagColour:'grey'};
    }
  }


  return (
    <>

    <table className='govuk-summary-list'>
      <thead>
        <tr className='govuk-summary-list__row'><h2 className='govuk-heading-m'>{title}</h2></tr>
      </thead>
      <tbody>
      {data.map(row => {
        return (
          <tr className='govuk-summary-list__row' key={row.pyID}>
            <td className='govuk-summary-card__content'>
              <div className='govuk-card govuk-grid-row'>
                <div className='govuk-grid-column-two-thirds govuk-!-padding-0' >
                  {options.map((field) => {

                    const value = resolveProperty(row, field.name);
                    //Handle Name concatenation
                    if(field.name.includes('FirstName')){
                      let response = value? value : '';

                      const lastNameResults = options.filter(field => field.name.includes('LastName'))
                      if(lastNameResults.length > 0){
                        const lastName = resolveProperty(row, lastNameResults[0].name);
                        response = response.concat(` ${lastName}`);
                      }

                      //placehodler for making name clickable link logic
                      if(1){
                        return (<div className='govuk-heading-m'><a>{response}</a></div>)
                      } else {
                        return (<div>{response}</div>)
                      }
                    }
                    //All other fields except for case status
                    if(field.name !== 'pyStatusWork' && !field.name.includes('FirstName') && !field.name.includes('LastName')){
                      if(field.type === 'Date'){
                        return (<div>{DateFormatter.Date(value, {format:"DD MMMM YYYY"})}</div>)
                      }
                      else {
                        return (<div>{value}</div>)
                      }
                    }
                  })}
                </div>
                <div className='govuk-grid-column-one-third govuk-!-padding-0'>
                  {/*Displays Case status*/}
                  <strong className={`govuk-tag govuk-tag--${statusMapping(row.pyStatusWork).tagColour}`}>
                    {statusMapping(row.pyStatusWork).text}
                  </strong>
                </div>

              </div>
            </td>
          </tr>
        )
      })}
      </tbody>
    </table>
    </>
  )

}
