const Alexa = require('ask-sdk-core');

const StartIntentHandler = require('./StartIntentHandler');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
    );
  },
  async handle(handlerInput) {
    const response = await StartIntentHandler.handle(handlerInput);

    return response;
  },
};

module.exports = LaunchRequestHandler;
