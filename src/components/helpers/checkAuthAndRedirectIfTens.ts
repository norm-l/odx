interface DataPageResponse {
  IsNormalAuthentication: boolean;
  PostAuthAction: string;
}

async function checkAuthAndRedirectIfTens(): Promise<void> {
  if (localStorage.getItem('tensCheckCarriedOut') === 'true') {
    // After the redirect from TENS
    localStorage.removeItem('tensCheckCarriedOut');
    return;
  }

  const dataPage: Promise<DataPageResponse> = PCore.getDataPageUtils().getPageDataAsync(
    'D_PostCitizenAuthAction',
    'root'
  ) as Promise<DataPageResponse>;
  const dataResponse: DataPageResponse = await dataPage;
  if (dataResponse?.IsNormalAuthentication === false && dataResponse?.PostAuthAction === 'TENS') {
    localStorage.setItem('tensCheckCarriedOut', 'true');
    const currentPage: string = window.location.href;
    window.location.replace(
      `https://www.tax.service.gov.uk/protect-tax-info?redirectUrl=${currentPage}`
    ); // This will not work in Dev as this is only available in prod
  }
}

export default checkAuthAndRedirectIfTens;
