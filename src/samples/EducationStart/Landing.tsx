// @ts-nocheck

import React, { useEffect, useState } from 'react';
import StartClaim from './StartClaim';
import PortalPage from './PortalPage';

export default function Landing({ onProceedHandler, assignmentPConn }) {
  const [inProgressClaims, setInProgressClaims] = useState([]);
  const [submittedClaims, setSubmittedClaims] = useState([]);
  const [showStartClaim, setShowStartClaim] = useState(false);

  function fetchSubmittedClaimsData() {
    const operatorId = PCore.getEnvironmentInfo().getOperatorIdentifier();
    PCore.getDataPageUtils()
      // @ts-ignore
      .getDataAsync('D_ClaimantSubmittedEdStartCases', 'root', { OperatorId: operatorId })
      .then(resp => {
        setSubmittedClaims(resp.data.slice(0, 10));
        console.log(resp);
      });
    // .finally(() => setLoadingSubmittedClaims(false));
  }

  function fetchInProgressClaimsData(isSaveComeBackClicked = false) {
    // setLoadingInProgressClaims(true);
    let inProgressClaimsData: any = [];
    // @ts-ignore
    PCore.getDataPageUtils()
      .getDataAsync('D_ClaimantWorkAssignmentEdStartCases', 'root')
      .then(resp => {
        resp = resp.data.slice(0, 10);
        inProgressClaimsData = resp;
        setInProgressClaims(inProgressClaimsData);
        // setLoadingInProgressClaims(false);
        console.log(resp);
      })
      .finally(() => {
        if (isSaveComeBackClicked) {
          // Here we are calling this close container because of the fact that above
          // D_ClaimantWorkAssignmentChBCases API is getting excuted as last call but we want to make
          // close container call as the very last one.
          PCore.getContainerUtils().closeContainerItem(
            PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
            { skipDirtyCheck: true }
          );
        }
      });
  }

  useEffect(() => {
    fetchInProgressClaimsData();
    fetchSubmittedClaimsData();
  }, []);

  return (
    <>
      {!showStartClaim && (inProgressClaims.length || submittedClaims.length) ? (
        <PortalPage inProgressClaims={inProgressClaims} submittedClaims={submittedClaims} assignmentPConn={assignmentPConn} onProceedHandler={onProceedHandler} setShowStartClaim={setShowStartClaim}/>
      ) : (
        <StartClaim onProceedHandler={onProceedHandler} />
       )}
    </>
  );
}
