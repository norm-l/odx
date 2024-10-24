import RunTensCheck from './TensCheckService';

describe('RunTensCheck', () => {
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

  test('should return true and redirect when IsNormalAuthentication is false', async () => {
    // Mock the response with IsNormalAuthentication === false
    mockGetPageDataAsync.mockResolvedValue({ IsNormalAuthentication: false });

    const result: boolean = await RunTensCheck();

    expect(result).toBe(true);
    expect(mockRedirect).toHaveBeenCalledWith(
      `https://www.tax.service.gov.uk/protect-tax-info?redirectUrl=${currentPageURL}`
    );
  });

  test('should return false when IsNormalAuthentication is true', async () => {
    // Mock the response with IsNormalAuthentication === true
    mockGetPageDataAsync.mockResolvedValue({ IsNormalAuthentication: true });

    const result: boolean = await RunTensCheck();

    expect(result).toBe(false);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
