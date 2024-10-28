interface PageDataResponse {
  IsNormalAuthentication: boolean;
  PostAuthAction: string;
}

async function CheckAuthAndRedirectIfTens(): Promise<void> {
  const dataPage: Promise<PageDataResponse> = PCore.getDataPageUtils().getPageDataAsync(
    'D_PostCitizenAuthAction',
    'root'
  ) as Promise<PageDataResponse>;
  const response: PageDataResponse = await dataPage;
  if (response?.IsNormalAuthentication === false && response?.PostAuthAction === 'TENS') {
    const currentPage: string = window.location.href;
    window.location.replace(
      `https://www.tax.service.gov.uk/protect-tax-info?redirectUrl=${currentPage}`
    ); // This will not work in Dev as this is only available in prod
  }
}

export default CheckAuthAndRedirectIfTens;
