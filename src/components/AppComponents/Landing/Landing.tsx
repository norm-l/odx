import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../helpers/setPageTitleHelpers';
import NotificationBanner from '../../BaseComponents/NotificationBanner/NotificationBanner';
import RegistrationDetails from '../../templates/RegistrationDetails';
import { checkStatus } from '../../helpers/utils';
import AskHMRC from '../AskHMRC';

export default function Landing(props) {
  const { showPortalBanner, isLogout, pConn, inProgressCaseCountEndPoint, creatCaseEndpoint } =
    props;
  const { t } = useTranslation();
  const [inprogressRegistration, setInprogressRegistration] = useState([]);
  const [loadingInProgressRegistration, setLoadingInProgressRegistration] = useState(true);

  useEffect(() => {
    setPageTitle();
    fetchInProgressRegistrationData();
  }, []);

  // Calls data page to fetch in progress registration,
  // This then sets inprogress registration state value to the registration details.
  // This funtion also sets 'isloading' value to true before making d_page calls
  function fetchInProgressRegistrationData() {
    setLoadingInProgressRegistration(true);
    let inProgressRegData: any = [];
    const context = pConn.getContextName();

    PCore.getDataPageUtils()
      .getDataAsync(inProgressCaseCountEndPoint, context, {}, {}, {}, {})
      // @ts-ignore
      .then(resp => {
        if (!resp.resultCount) {
          createCase();
        } else {
          resp = resp.data.slice(0, 10);
          inProgressRegData = resp;
          setInprogressRegistration(inProgressRegData);
        }
        setLoadingInProgressRegistration(false);
      });
    sessionStorage.setItem('assignmentFinishedFlag', 'false');
  }

  function createCase() {
    PCore.getMashupApi()
      .createCase(creatCaseEndpoint, PCore.getConstants().APP.APP)
      // @ts-ignore
      .then(() => {
        checkStatus();
      });
  }

  return (
    !loadingInProgressRegistration &&
    inprogressRegistration.length > 0 && (
      <>
        <main
          className={isLogout ? 'govuk-main-wrapper visibility-hidden' : 'govuk-main-wrapper'}
          id='main-content'
          role='main'
        >
          {showPortalBanner && (
            <NotificationBanner content={t('PORTAL_NOTIFICATION_BANNER_CONTENT')} />
          )}
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body govuk-!-padding-right-0 govuk-!-padding-left-0'>
              {/* SA Registration */}
              <div className='govuk-grid-column-two-thirds'>
                <>
                  {inprogressRegistration.length > 0 && (
                    <>
                      <RegistrationDetails
                        thePConn={pConn}
                        data={inprogressRegistration}
                        rowClickAction='OpenAssignment'
                        buttonContent={t('CONTINUE_YOUR_REGISTRATION')}
                      />
                      <AskHMRC />
                    </>
                  )}
                </>
              </div>
            </div>
          </div>
        </main>
      </>

      // !loadingInProgressClaims &&
      // !loadingSubmittedClaims && (
      //     <>
      //       {showPortalPageDefault ||
      //         (!showStartClaim.status && (inProgressClaims.length || submittedClaims.length))(
      //           <StartClaim
      //             handleStartCliam={handleStartCliam}
      //             setShowStartClaim={setShowStartClaim}
      //             showStartClaim={showStartClaim}
      //             setShowPortalPageDefault={setShowPortalPageDefault}
      //             setShowPortalBanner={setShowPortalBanner}
      //           />
      //         )}
      //     </>
      //   <>
      //     <main
      //       className={false ? 'govuk-main-wrapper visibility-hidden' : 'govuk-main-wrapper'}
      //       id='main-content'
      //       role='main'
      //     >
      //       <div className='govuk-grid-row'>
      //         <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body govuk-!-padding-right-0 govuk-!-padding-left-0'>
      //           {/* SA Registration */}
      //           <div className='govuk-grid-column-two-thirds'>
      //             <>
      //               <div className='govuk-grid-row'>
      //                 <div className='govuk-grid-column-two-thirds'>
      //                   <h1 className='govuk-heading-l'>Heading will appear here</h1>
      //                 </div>
      //               </div>
      //               <dl className='govuk-summary-list'>
      //                 <div className='govuk-summary-list__row govuk-summary-list__row'>
      //                   <dt className='govuk-summary-list__key govuk-!-width-one-third'>
      //                     {t('DATE_CREATED')}
      //                   </dt>
      //                   <dd className='govuk-summary-list__value govuk-!-width-one-third'>
      //                     20/09/2024
      //                   </dd>
      //                   <dd className='govuk-summary-list__value govuk-!-width-one-third'>
      //                     <strong className={`govuk-tag govuk-tag--${'dataItem.status.tagColour'}`}>
      //                       dummy text
      //                     </strong>
      //                   </dd>
      //                 </div>
      //               </dl>
      //               dummy actionButton
      //             </>
      //           </div>
      //         </div>
      //       </div>
      //     </main>
      //   </>
    )
  );
}
