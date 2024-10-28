import CheckAuthAndRedirectIfTens from './TensCheckService';

describe('CheckAuthAndRedirectIfTens', () => {
  const mockGetPageDataAsync = jest.fn();
  const mockRedirect = jest.fn();
  const currentPageURL = 'www.currentPageUrl.com';

  beforeEach(() => {
    // Mocking PCore.getDataPageUtils().getPageDataAsync
    (window as any).PCore = {
      getDataPageUtils: jest.fn(() => ({
        getPageDataAsync: mockGetPageDataAsync
      }))
    };

    // Mocking window.location.replace
    Object.defineProperty(window, 'location', {
      value: { replace: mockRedirect, href: currentPageURL },
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should return true and redirect when IsNormalAuthentication is false and PostAuthAction is TENS', async () => {
    // Mock the response with IsNormalAuthentication === false
    mockGetPageDataAsync.mockResolvedValue({
      IsNormalAuthentication: false,
      PostAuthAction: 'TENS'
    });

    await CheckAuthAndRedirectIfTens();

    expect(mockRedirect).toHaveBeenCalledWith(
      `https://www.tax.service.gov.uk/protect-tax-info?redirectUrl=${currentPageURL}`
    );
  });

  test('should return true and redirect when IsNormalAuthentication is false and PostAuthAction is not TENS', async () => {
    // Mock the response with IsNormalAuthentication === false
    mockGetPageDataAsync.mockResolvedValue({
      IsNormalAuthentication: false,
      PostAuthAction: 'Other'
    });

    await CheckAuthAndRedirectIfTens();

    expect(mockRedirect).not.toHaveBeenCalled();
  });

  test('should return false when IsNormalAuthentication is true and PostAuthAction is not TENS', async () => {
    // Mock the response with IsNormalAuthentication === true
    mockGetPageDataAsync.mockResolvedValue({
      IsNormalAuthentication: true,
      PostAuthAction: 'Other'
    });

    await CheckAuthAndRedirectIfTens();

    expect(mockRedirect).not.toHaveBeenCalled();
  });

  test('should return false when IsNormalAuthentication is true and PostAuthAction is TENS', async () => {
    // Mock the response with IsNormalAuthentication === true
    mockGetPageDataAsync.mockResolvedValue({
      IsNormalAuthentication: true,
      PostAuthAction: 'TENS'
    });

    await CheckAuthAndRedirectIfTens();

    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
