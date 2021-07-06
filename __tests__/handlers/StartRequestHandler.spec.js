const Alexa = require('ask-sdk-core');

const StartIntentHandler = require('../../lambda/handlers/StartIntentHandler');
const ListRead = require('../../lambda/responses/ListReadResponse');
const DividendInfo = require('../../lambda/responses/DividendInfoResponse');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 02. Test scenario: StartIntent', () => {
  const mockListRead = jest.fn();
  const mockDividendInfo = jest.fn();
  ListRead.getResponse = mockListRead;
  DividendInfo.getResponse = mockDividendInfo;

  const handlerInput = {
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'StartIntent',
        },
      },
      context: {
        System: {},
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  beforeEach(() => {
    handlerInput.requestEnvelope.request.type = 'IntentRequest';
    handlerInput.requestEnvelope.request.intent.name = 'StartIntent';
  });

  it('should be able can not handle StartIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.type = 'AnotherRequest';

    expect(StartIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able to handle requests', () => {
    expect(StartIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return response', async () => {
    const outputSpeech = testResponseBuilder
      .speak(speaks.VOICE_START + speaks.PERMISSION_CARD_MSG + speaks.VOICE_END)
      .withAskForPermissionsConsentCard(['read::alexa:household:list'])
      .getResponse();

    mockListRead.mockImplementation(() => outputSpeech);

    expect(await StartIntentHandler.handle(handlerInput)).toEqual(outputSpeech);
  });

  it('should be able can return response with dividend info', async () => {
    // Unreal. For testing purposes only.
    const outputSpeech = testResponseBuilder
      .speak(speaks.VOICE_START + speaks.THREE_ITEMS + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.WELCOME)
      .withShouldEndSession(true)
      .getResponse();

    mockListRead.mockReturnValueOnce({
      // Example of list id string
      listId: 'ff097d45-c098-44af-a2e9-7dae032b270b',
    });

    mockDividendInfo.mockImplementation(() => outputSpeech);

    expect(await StartIntentHandler.handle(handlerInput)).toEqual(outputSpeech);
  });
});
