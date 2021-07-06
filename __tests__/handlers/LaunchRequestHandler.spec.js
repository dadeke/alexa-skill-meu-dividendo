const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = require('../../lambda/handlers/LaunchRequestHandler');
const StartIntentHandler = require('../../lambda/handlers/StartIntentHandler');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 01. Test scenario: launch request. no further interaction.', () => {
  const mockStartIntentHandler = jest.fn();
  StartIntentHandler.handle = mockStartIntentHandler;

  const handlerInput = {
    requestEnvelope: {
      request: {
        type: 'LaunchRequest',
      },
      context: {
        System: {},
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  beforeEach(() => {
    handlerInput.requestEnvelope.request.type = 'LaunchRequest';
  });

  it('should be able can not handle LaunchRequest if type is diferent', () => {
    handlerInput.requestEnvelope.request.type = 'AnotherRequest';

    expect(LaunchRequestHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able to handle requests', () => {
    expect(LaunchRequestHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return response', async () => {
    // Unreal. For testing purposes only.
    const outputSpeech = testResponseBuilder
      .speak(speaks.VOICE_START + speaks.WELCOME + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.WELCOME)
      .withShouldEndSession(true)
      .getResponse();

    mockStartIntentHandler.mockImplementation(() => outputSpeech);

    expect(await LaunchRequestHandler.handle(handlerInput)).toEqual(
      outputSpeech,
    );
  });
});
