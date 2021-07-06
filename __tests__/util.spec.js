const Util = require('../lambda/util');

describe('Test Util', () => {
  const mockConsoleError = jest.fn();
  const getPersistentAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

  const handlerInput = {
    attributesManager: {
      getPersistentAttributes,
      setPersistentAttributes,
      savePersistentAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
      },
      context: {
        System: {},
      },
    },
  };

  it('should be able call getNumberRand with success', () => {
    const number = Util.getNumberRand(2);

    expect(number === 0 || number === 1 || number === 2).toBe(true);
  });

  it('should be able call setLastAccess with success', () => {
    Util.setLastAccess(handlerInput);

    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able call setLastAccess personalized with success', () => {
    Util.setLastAccess(handlerInput);

    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able call setLastAccess with error', async () => {
    // Simulates a generic error when persisting data.
    savePersistentAttributes.mockImplementation(() => {
      throw new Error('InternalError');
    });

    await Util.setLastAccess(handlerInput);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'setLastAccess - Error: InternalError',
    );
  });
});
