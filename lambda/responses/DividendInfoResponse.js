const formatDate = require('date-fns/format');
const locale = require('date-fns/locale/pt-BR');

const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

const Dividend = require('../api/dividend');

const listStatuses = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

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

const DividendInfo = {
  async getResponse(handlerInput, listId) {
    const { attributesManager, serviceClientFactory } = handlerInput;
    const { device } = handlerInput.requestEnvelope.context.System;

    let userTimeZone;

    try {
      const upsServiceClient = serviceClientFactory.getUpsServiceClient();
      userTimeZone = await upsServiceClient.getSystemTimeZone(device.deviceId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `DividendInfo.getResponse - ${error.message}`);

      return handlerInput.responseBuilder
        .speak(speaks.VOICE_START + speaks.PROBLEM + speaks.VOICE_END)
        .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
        .withShouldEndSession(true)
        .getResponse();
    }

    try {
      const listClient = serviceClientFactory.getListManagementServiceClient();
      const list = await listClient.getList(listId, listStatuses.ACTIVE);

      if (!list) {
        return handlerInput.responseBuilder
          .speak(
            speaks.VOICE_START +
              speaks.WELCOME +
              speaks.LIST_NOT_FOUND +
              speaks.VOICE_END,
          )
          .withStandardCard(speaks.SKILL_NAME, speaks.LIST_NOT_FOUND)
          .withShouldEndSession(true)
          .getResponse();
      }

      if (!list.items || list.items.length === 0) {
        return handlerInput.responseBuilder
          .speak(
            speaks.VOICE_START +
              speaks.WELCOME +
              speaks.LIST_EMPTY +
              speaks.VOICE_END,
          )
          .withStandardCard(speaks.SKILL_NAME, speaks.LIST_EMPTY)
          .withShouldEndSession(true)
          .getResponse();
      }

      let speakOutput = speaks.VOICE_START;
      let outputCard = speaks.THREE_ITEMS_CARD;

      const dateNow = new Date(
        new Date().toLocaleString('en-US', { timeZone: userTimeZone }),
      );
      const currentHour = dateNow.getHours();

      let greetingNow = speaks.GOOD_EVENING;
      if (currentHour < 12) {
        greetingNow = speaks.GOOD_MORNING;
      } else if (currentHour < 18) {
        greetingNow = speaks.GOOD_AFTERNOON;
      }

      speakOutput += speaks.GREETING.format(greetingNow);

      const persistentAttributes =
        (await attributesManager.getPersistentAttributes()) || {};
      const lastAccess = Object.prototype.hasOwnProperty.call(
        persistentAttributes,
        'default',
      )
        ? persistentAttributes.default.lastAccess
        : false;

      if (lastAccess !== false) {
        speakOutput += speaks.WELCOME_BACK;
      } else {
        speakOutput += speaks.WELCOME;
      }

      const itemsRequest = [];
      // Max three
      for (let index = 0; index < list.items.length && index < 3; index += 1) {
        itemsRequest.push(list.items[index].value.toUpperCase());
      }

      const response = await Dividend.getInfo(itemsRequest);

      if (response !== null && response.body.length > 0) {
        const itemsFormated = formatItems(response.body);

        speakOutput +=
          speaks.THREE_ITEMS + itemsFormated.speakOutput + speaks.VOICE_END;
        outputCard += itemsFormated.cardOutput;
      } else if (response !== null && response.body.length === 0) {
        speakOutput += speaks.INVALID_TICKERS + speaks.VOICE_END;

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withStandardCard(speaks.SKILL_NAME, speaks.INVALID_TICKERS)
          .withShouldEndSession(true)
          .getResponse();
      } else {
        throw new Error('response is null');
      }

      await setLastAccess(handlerInput);

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withStandardCard(speaks.SKILL_NAME, outputCard)
        .withShouldEndSession(true)
        .getResponse();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `DividendInfo.getResponse - ${error}`);
    }

    return handlerInput.responseBuilder
      .speak(speaks.VOICE_START + speaks.PROBLEM + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = DividendInfo;
