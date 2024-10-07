import React, { useEffect, useState } from 'react';
import setPageTitle from '../../helpers/setPageTitleHelpers';
import NotificationBanner from '../../BaseComponents/NotificationBanner/NotificationBanner';
import CaseDetails from './CaseDetails';
import { checkStatus } from '../../helpers/utils';
import AskHMRC from '../AskHMRC';

export default function Landing(props) {
  const {
    showPortalBanner,
    isLogout,
    pConn,
    inProgressCaseCountEndPoint,
    creatCaseEndpoint,
    buttonContent,
    title,
    bannerContent,
    handleCaseContinue,
    caseListApiParams
  } = props;
  const [inprogressCaseDetail, setInprogressCaseDetail] = useState([]);
  const [loadingInProgressCaseDetail, setLoadingInProgressCaseDetail] = useState(true);

  function createCase() {
    PCore.getMashupApi()
      .createCase(creatCaseEndpoint, PCore.getConstants().APP.APP)
  }

  // Calls data page to fetch in progress caseDetail,
  // This then sets inprogress caseDetail state value to the caseDetail details.
  // This funtion also sets 'isloading' value to true before making d_page calls
  function fetchInProgressCaseDetailData() {
    setLoadingInProgressCaseDetail(true);
    let inProgressRegData: any = [];
    const context = pConn.getContextName();

    PCore.getDataPageUtils()
      // @ts-ignore
      .getDataAsync(inProgressCaseCountEndPoint, context, { ...caseListApiParams })
      // @ts-ignore
      .then(resp => {
        if (!resp.resultCount) {
          createCase();
        } else {
          resp = resp.data.slice(0, 10);
          inProgressRegData = resp;
          setInprogressCaseDetail(inProgressRegData);
        }
        setLoadingInProgressCaseDetail(false);
      });
    sessionStorage.setItem('assignmentFinishedFlag', 'false');
  }

  useEffect(() => {
    setPageTitle();
    fetchInProgressCaseDetailData();
  }, []);

  return (
    !loadingInProgressCaseDetail &&
    inprogressCaseDetail.length > 0 && (
      <>
        <main
          className={`govuk-main-wrapper ${isLogout ? 'visibility-hidden' : ''}`}
          id='main-content'
          role='main'
        >
          {showPortalBanner && <NotificationBanner content={bannerContent} />}
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body govuk-!-padding-right-0 govuk-!-padding-left-0'>
              {/* CaseDetail */}
              <div className='govuk-grid-column-two-thirds'>
                <>
                  {inprogressCaseDetail.length > 0 && (
                    <>
                      <CaseDetails
                        thePConn={pConn}
                        data={inprogressCaseDetail}
                        rowClickAction='OpenAssignment'
                        buttonContent={buttonContent}
                        title={title}
                        handleCaseContinue={handleCaseContinue}
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
    )
  );
}
