const Alexa = require('ask-sdk-core');

const speaks = require('../speakStrings');

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(speaks.VOICE_START + speaks.FALLBACK + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.FALLBACK)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = FallbackIntentHandler;
