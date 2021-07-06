const Alexa = require('ask-sdk-core');
const formatDate = require('date-fns/format');
const locale = require('date-fns/locale/pt-BR');

const Dividend = require('../../lambda/api/dividend');
const DividendInfo = require('../../lambda/responses/DividendInfoResponse');
const speaks = require('../../lambda/speakStrings');

const deviceId = 'amzn1.ask.device.XXXXXXXX';
const deviceTimeZone = 'America/Sao_Paulo';

function formatItems(itemsResponse) {
  let speakOutput = '';
  let cardOutput = '';

  for (let index = 0; index < itemsResponse.length; index += 1) {
    const type =
      itemsResponse[index].dividend_type === 'dividendos'
        ? speaks.DIVIDEND_TYPE1
        : speaks.DIVIDEND_TYPE2;
    const approvalDate = formatDate(
      new Date(itemsResponse[index].approval_date),
      speaks.DATE_FORMAT,
      { locale },
    );
    const exDate = formatDate(
      new Date(itemsResponse[index].exdividend_date),
      speaks.DATE_FORMAT,
      { locale },
    );
    const paymentDate =
      itemsResponse[index].payment_date !== ''
        ? formatDate(
            new Date(itemsResponse[index].payment_date),
            speaks.DATE_FORMAT,
            { locale },
          )
        : speaks.NO_DEFINED_DATE;
    const exDateCard = formatDate(
      new Date(itemsResponse[index].exdividend_date),
      speaks.DATE_FORMAT_CARD,
      { locale },
    );
    const paymentDateCard =
      itemsResponse[index].payment_date !== ''
        ? formatDate(
            new Date(itemsResponse[index].payment_date),
            speaks.DATE_FORMAT_CARD,
            { locale },
          )
        : speaks.NO_DEFINED_DATE;

    speakOutput += speaks.DIVIDEND_ITEM.format(
      itemsResponse[index].ticker,
      type,
      approvalDate,
      exDate,
      paymentDate,
      itemsResponse[index].value,
    );

    cardOutput += speaks.DIVIDEND_ITEM_CARD.format(
      itemsResponse[index].ticker,
      exDateCard,
      paymentDateCard,
      itemsResponse[index].value,
    );
  }

  return { speakOutput, cardOutput };
}

describe('Test DividendInfoResponse', () => {
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  const mockGetPersistentAttributes = jest.fn();
  const mockGetSystemTimeZone = jest.fn();
  const mockGetList = jest.fn();
  const mockDividendGetInfo = jest.fn();
  Dividend.getInfo = mockDividendGetInfo;
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

  const handlerInput = {
    attributesManager: {
      getPersistentAttributes: mockGetPersistentAttributes,
      setPersistentAttributes,
      savePersistentAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'StartIntent',
        },
      },
      context: {
        System: {
          device: {
            deviceId,
          },
        },
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
    serviceClientFactory: {
      getListManagementServiceClient: () => ({
        getList: mockGetList,
      }),
      getUpsServiceClient: () => ({
        getSystemTimeZone: mockGetSystemTimeZone,
      }),
    },
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

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
        ticker: 'CRFB3',
        dividend_type: 'jscp',
        approval_date: '2021-06-11',
        exdividend_date: '2021-06-21',
        payment_date: '2021-06-30',
        value: '0,088148225',
      },
      {
        ticker: 'VALE3',
        dividend_type: 'dividendos',
        approval_date: '2021-06-17',
        exdividend_date: '2021-06-24',
        payment_date: '2021-06-30',
        value: '2,177096137',
      },
    ],
  };

  const listItems = {
    items: [
      {
        value: 'ITUB4',
      },
      {
        value: 'GRND3',
      },
      {
        value: 'VALE3',
      },
    ],
  };

  it('should be able can return response when service return ServiceError', async () => {
    mockGetSystemTimeZone.mockImplementationOnce(() => {
      const error = {
        name: 'ServiceError',
        message: 'Message to simulation ServiceError.',
      };

      throw error;
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.VOICE_START + speaks.PROBLEM + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await DividendInfo.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'DividendInfo.getResponse - Message to simulation ServiceError.',
    );
  });

  it('should be able can return response with list not found', async () => {
    mockGetList.mockReturnValueOnce(null);

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.VOICE_START +
          speaks.WELCOME +
          speaks.LIST_NOT_FOUND +
          speaks.VOICE_END,
      )
      .withStandardCard(speaks.SKILL_NAME, speaks.LIST_NOT_FOUND)
      .withShouldEndSession(true)
      .getResponse();

    const response = await DividendInfo.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with list empty', async () => {
    mockGetList.mockReturnValueOnce({
      items: [],
    });

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.VOICE_START +
          speaks.WELCOME +
          speaks.LIST_EMPTY +
          speaks.VOICE_END,
      )
      .withStandardCard(speaks.SKILL_NAME, speaks.LIST_EMPTY)
      .withShouldEndSession(true)
      .getResponse();

    const response = await DividendInfo.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response problem when Dividend.getInfo null', async () => {
    mockGetList.mockReturnValueOnce(listItems);
    mockDividendGetInfo.mockReturnValueOnce(null);

    const outputSpeech = testResponseBuilder
      .speak(speaks.VOICE_START + speaks.PROBLEM + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await DividendInfo.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'DividendInfo.getResponse - Error: response is null',
    );
  });

  it('should be able can return response invalid tickers when response.body.length is 0', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2021-07-01T07:00:00.000-03:00'));

    mockGetList.mockReturnValueOnce({
      items: [
        {
          value: 'TEST',
        },
      ],
    });
    mockDividendGetInfo.mockReturnValueOnce({
      status: 'OK',
      body: [],
    });

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.VOICE_START +
          speaks.GREETING.format(speaks.GOOD_MORNING) +
          speaks.WELCOME +
          speaks.INVALID_TICKERS +
          speaks.VOICE_END,
      )
      .withStandardCard(speaks.SKILL_NAME, speaks.INVALID_TICKERS)
      .withShouldEndSession(true)
      .getResponse();

    const response = await DividendInfo.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with good morning', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2021-07-01T07:00:00.000-03:00'));

    mockGetSystemTimeZone.mockReturnValueOnce(deviceTimeZone);
    mockGetList.mockReturnValueOnce(listItems);
    mockDividendGetInfo.mockReturnValueOnce(apiMockResponse);

    const itemsFormated = formatItems(apiMockResponse.body);

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.VOICE_START +
          speaks.GREETING.format(speaks.GOOD_MORNING) +
          speaks.WELCOME +
          speaks.THREE_ITEMS +
          itemsFormated.speakOutput +
          speaks.VOICE_END,
      )
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.THREE_ITEMS_CARD + itemsFormated.cardOutput,
      )
      .withShouldEndSession(true)
      .getResponse();

    const response = await DividendInfo.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with good afternoon', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2021-07-01T15:00:00.000-03:00'));

    mockGetSystemTimeZone.mockReturnValueOnce(deviceTimeZone);
    mockGetList.mockReturnValueOnce(listItems);
    mockDividendGetInfo.mockReturnValueOnce(apiMockResponse);

    const itemsFormated = formatItems(apiMockResponse.body);

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.VOICE_START +
          speaks.GREETING.format(speaks.GOOD_AFTERNOON) +
          speaks.WELCOME +
          speaks.THREE_ITEMS +
          itemsFormated.speakOutput +
          speaks.VOICE_END,
      )
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.THREE_ITEMS_CARD + itemsFormated.cardOutput,
      )
      .withShouldEndSession(true)
      .getResponse();

    const response = await DividendInfo.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with good evening', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2021-07-01T20:00:00.000-03:00'));

    mockGetSystemTimeZone.mockReturnValueOnce(deviceTimeZone);
    mockGetList.mockReturnValueOnce(listItems);
    mockDividendGetInfo.mockReturnValueOnce(apiMockResponse);

    const itemsFormated = formatItems(apiMockResponse.body);

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.VOICE_START +
          speaks.GREETING.format(speaks.GOOD_EVENING) +
          speaks.WELCOME +
          speaks.THREE_ITEMS +
          itemsFormated.speakOutput +
          speaks.VOICE_END,
      )
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.THREE_ITEMS_CARD + itemsFormated.cardOutput,
      )
      .withShouldEndSession(true)
      .getResponse();

    const response = await DividendInfo.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with welcome back', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2021-07-01T16:23:34.000-03:00'));

    mockGetPersistentAttributes.mockReturnValue({
      default: {
        lastAccess: '2021-07-01T16:23:34.531Z',
      },
    });
    mockGetSystemTimeZone.mockReturnValueOnce(deviceTimeZone);
    mockGetList.mockReturnValueOnce(listItems);
    mockDividendGetInfo.mockReturnValueOnce(apiMockResponse);

    const itemsFormated = formatItems(apiMockResponse.body);

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.VOICE_START +
          speaks.GREETING.format(speaks.GOOD_AFTERNOON) +
          speaks.WELCOME_BACK +
          speaks.THREE_ITEMS +
          itemsFormated.speakOutput +
          speaks.VOICE_END,
      )
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.THREE_ITEMS_CARD + itemsFormated.cardOutput,
      )
      .withShouldEndSession(true)
      .getResponse();

    const response = await DividendInfo.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
