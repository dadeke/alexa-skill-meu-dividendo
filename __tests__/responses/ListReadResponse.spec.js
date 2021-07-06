const Alexa = require('ask-sdk-core');

const ListRead = require('../../lambda/responses/ListReadResponse');
const speaks = require('../../lambda/speakStrings');

describe('Test ListReadResponse', () => {
  const getPersistentAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  const mockGetListsMetadata = jest.fn();
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

  const handlerInput = {
    attributesManager: {
      getPersistentAttributes,
      setPersistentAttributes,
      savePersistentAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
      },
      context: {
        System: {},
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
    serviceClientFactory: {
      getListManagementServiceClient: () => ({
        getListsMetadata: mockGetListsMetadata,
      }),
    },
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  it('should be able can return response with problem', async () => {
    mockGetListsMetadata.mockReturnValueOnce({ lists: null });

    const outputSpeech = testResponseBuilder
      .speak(speaks.VOICE_START + speaks.PROBLEM + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await ListRead.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      "ListRead.getResponse - Cannot read property 'length' of null",
    );
  });

  it('should be able can return response with ask for permissions consent card', async () => {
    mockGetListsMetadata.mockImplementationOnce(() => {
      const error = {
        name: 'Forbidden',
        message: 'Message to simulation Forbidden.',
      };

      throw error;
    });

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.VOICE_START +
          speaks.WELCOME +
          speaks.PERMISSION_CARD_MSG +
          speaks.VOICE_END,
      )
      .withAskForPermissionsConsentCard(['read::alexa:household:list'])
      .getResponse();

    const response = await ListRead.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response when lists metadata is null', async () => {
    mockGetListsMetadata.mockReturnValueOnce(null);

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.VOICE_START +
          speaks.WELCOME +
          speaks.PERMISSION_CARD_MSG +
          speaks.VOICE_END,
      )
      .withAskForPermissionsConsentCard(['read::alexa:household:list'])
      .getResponse();

    const response = await ListRead.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with list not found', async () => {
    mockGetListsMetadata.mockReturnValueOnce({
      lists: [
        {
          listId: 'shopping_list_list_id',
          name: 'Alexa shopping list',
        },
      ],
    });

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

    const response = await ListRead.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with list id', async () => {
    const listId = 'ff097d45-c098-44af-a2e9-7dae032b270b';

    mockGetListsMetadata.mockReturnValueOnce({
      lists: [
        {
          listId: 'shopping_list_list_id',
          name: 'Alexa shopping list',
        },
        {
          listId,
          name: 'Dividendo',
        },
      ],
    });

    const response = await ListRead.getResponse(handlerInput);

    expect(response).toEqual({ listId });
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
