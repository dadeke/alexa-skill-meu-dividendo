const Alexa = require('ask-sdk-core');

const speaks = require('../speakStrings');

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(speaks.VOICE_START + speaks.HELP + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.HELP)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = HelpIntentHandler;
