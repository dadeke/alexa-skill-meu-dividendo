const axios = require('axios');
const AxiosMock = require('axios-mock-adapter');

const Dividend = require('../../lambda/api/dividend');

process.env.URL_API_DINFO = 'https://ws.yourwebservice.com';

const apiMock = new AxiosMock(axios);

describe('Test only code Dividend Info API', () => {
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

  const apiMockResponse = {
    status: 'OK',
    body: [
      {
        ticker: 'ITUB4',
        dividend_type: 'jscp',
        approval_date: '2021-05-13',
        exdividend_date: '2021-05-25',
        payment_date: '',
        value: '0,04874',
      },
      {
        ticker: 'VALE3',
        dividend_type: 'dividendos',
        approval_date: '2021-06-17',
        exdividend_date: '2021-06-24',
        payment_date: '2021-06-30',
        value: '2,177096137',
      },
      {
        ticker: 'CRFB3',
        dividend_type: 'jscp',
        approval_date: '2021-06-11',
        exdividend_date: '2021-06-21',
        payment_date: '2021-06-30',
        value: '0,088148225',
      },
    ],
  };
  const tickers = ['ITUB4', 'VALE3', 'CRFB3'];

  it('should be able call getInfo with success', async () => {
    apiMock.onPost(process.env.URL_API_DINFO).reply(200, apiMockResponse);

    await Dividend.getInfo(tickers);

    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able call getInfo with return error', async () => {
    apiMock.onPost(process.env.URL_API_DINFO).networkError();

    await Dividend.getInfo(tickers);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Dividend.getInfo - Error: Network Error',
    );
  });

  it('should be able call getInfo with return error in data', async () => {
    apiMockResponse.status = 'ERROR';

    apiMock.onPost(process.env.URL_API_DINFO).reply(200, apiMockResponse);

    await Dividend.getInfo(tickers);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Dividend.getInfo - Error: "status" is not OK',
    );
  });

  it('should be able call getInfo with return error when status code is not 200', async () => {
    apiMock.onPost(process.env.URL_API_DINFO).reply(500);

    await Dividend.getInfo(tickers);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Dividend.getInfo - Error: HTTP status code <500>',
    );
  });
});
