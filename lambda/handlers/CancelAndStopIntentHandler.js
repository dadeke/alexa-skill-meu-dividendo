const Alexa = require('ask-sdk-core');

const speaks = require('../speakStrings');
const Util = require('../util');

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.CancelIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          'AMAZON.StopIntent')
    );
  },
  async handle(handlerInput) {
    const number = Util.getNumberRand(2);

    return handlerInput.responseBuilder
      .speak(speaks.VOICE_START + speaks.BYE_BYE[number] + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.BYE_BYE[number])
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = CancelAndStopIntentHandler;
