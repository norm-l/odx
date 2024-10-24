interface PageDataResponse extends Object {
  IsNormalAuthentication: boolean;
  PostAuthAction: string;
}

async function RunTensCheck(): Promise<boolean> {
  const dataPage: Promise<PageDataResponse> = PCore.getDataPageUtils().getPageDataAsync(
    'D_PostCitizenAuthAction',
    'root'
  ) as Promise<PageDataResponse>;
  const response = await dataPage;
  console.log('RESPONSE::::', response);
  if (response?.IsNormalAuthentication === false) {
    const currentPage = window.location.href;
    window.location.replace(
      `https://www.tax.service.gov.uk/protect-tax-info?redirectUrl=${currentPage}`
    ); // This will not work in Dev as this is only available in prod
    return true;
  } else {
    return false;
  }
}

export default RunTensCheck;
