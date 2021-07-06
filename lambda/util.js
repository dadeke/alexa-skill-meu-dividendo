/* *
 * Shared utilities.
 * */

module.exports.getNumberRand = function getNumberRand(maxNumber) {
  return Math.floor(Math.random() * (maxNumber + 1));
};

module.exports.setLastAccess = async function setLastAccess(handlerInput) {
  try {
    const { attributesManager } = handlerInput;
    const persistentAttributes =
      (await attributesManager.getPersistentAttributes()) || {};

    persistentAttributes.default = {
      lastAccess: new Date().toISOString(),
    };

    attributesManager.setPersistentAttributes(persistentAttributes);
    await attributesManager.savePersistentAttributes();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`setLastAccess - ${error}`);
  }
};
