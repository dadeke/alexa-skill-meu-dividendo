const speaks = require('../speakStrings');

async function getDividendListId(handlerInput) {
  let listId = false;
  let listOfLists;

  const listClient =
    handlerInput.serviceClientFactory.getListManagementServiceClient();
  try {
    listOfLists = await listClient.getListsMetadata();

    if (!listOfLists) {
      return null;
    }
  } catch (error) {
    return null;
  }

  for (let index = 0; index < listOfLists.lists.length; index += 1) {
    const listName = listOfLists.lists[index].name;
    if (listName.toUpperCase().indexOf('DIVIDENDO') !== -1) {
      listId = listOfLists.lists[index].listId;
      break;
    }
  }

  return listId;
}

const ListRead = {
  async getResponse(handlerInput) {
    try {
      const listId = await getDividendListId(handlerInput);

      if (listId === null) {
        return handlerInput.responseBuilder
          .speak(
            speaks.VOICE_START +
              speaks.WELCOME +
              speaks.PERMISSION_CARD_MSG +
              speaks.VOICE_END,
          )
          .withAskForPermissionsConsentCard(['read::alexa:household:list'])
          .withShouldEndSession(true)
          .getResponse();
      }

      if (listId === false) {
        return handlerInput.responseBuilder
          .speak(
            speaks.VOICE_START +
              speaks.WELCOME +
              speaks.LIST_NOT_FOUND +
              speaks.VOICE_END,
          )
          .withStandardCard(speaks.SKILL_NAME, speaks.LIST_NOT_FOUND)
          .getResponse();
      }

      return { listId };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `ListRead.getResponse - ${error.message}`);
    }

    return handlerInput.responseBuilder
      .speak(speaks.VOICE_START + speaks.PROBLEM + speaks.VOICE_END)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = ListRead;
