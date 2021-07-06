const speaks = require('../speakStrings');

const ErrorHandler = {
  canHandle() {
    return true;
  },
  async handle(handlerInput, error) {
    // eslint-disable-next-line no-console
    console.error('Error handled:', JSON.stringify(error));

    return handlerInput.responseBuilder
      .speak(speaks.VOICE_START + speaks.PROBLEM + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = ErrorHandler;
