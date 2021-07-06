const Alexa = require('ask-sdk-core');

const ListRead = require('../responses/ListReadResponse');
const DividendInfo = require('../responses/DividendInfoResponse');

const StartIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartIntent'
    );
  },
  async handle(handlerInput) {
    let response = await ListRead.getResponse(handlerInput);

    if (response.listId !== undefined) {
      response = await DividendInfo.getResponse(handlerInput, response.listId);
    }

    return response;
  },
};

module.exports = StartIntentHandler;
