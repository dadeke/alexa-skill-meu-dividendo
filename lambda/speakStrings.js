/**
 * Format string.
 * Equivalent to "printf()" C/PHP or "String.Format()"
 * for C#/Java programmers.
 */
// eslint-disable-next-line no-extend-native
String.prototype.format = function formatString() {
  // eslint-disable-next-line prefer-rest-params
  const args = arguments;
  return this.replace(/\{(\d+)\}/g, (text, key) => args[key]);
};

const speaks = {
  SKILL_NAME: 'Meu Dividendo',
  GREETING: 'Olá {0}. ',
  GOOD_MORNING: 'bom dia',
  GOOD_AFTERNOON: 'boa tarde',
  GOOD_EVENING: 'boa noite', // Portuguese Brazil
  WELCOME: 'Seja bem vindo ao Meu Dividendo. ',
  WELCOME_BACK: 'Bem vindo de volta ao Meu Dividendo. ',
  THREE_ITEMS: 'Itens da sua lista. ',
  THREE_ITEMS_CARD: 'Itens da sua lista: \n\u200b\n',
  DIVIDEND_ITEM:
    '{0}, Tipo: {1}, Data da aprovação: {2}, Data ex: {3}, ' +
    'Data do pagamento: {4}, Valor: {5} por ação. ',
  DIVIDEND_ITEM_CARD:
    '{0} => Data ex: {1} - Data do pagamento: {2} - ' +
    'Valor: {3} por ação. \n\u200b\n',
  DIVIDEND_TYPE1: 'Dividendos',
  DIVIDEND_TYPE2: 'Juros sobre capital próprio',
  NO_DEFINED_DATE: 'Não definida',
  DATE_FORMAT: "dd 'de' MMMM 'de' yyyy",
  DATE_FORMAT_CARD: 'dd/MM/yyyy',
  HELP:
    'A skill "Meu Dividendo" informa a data dos últimos pagamentos de ' +
    'dividendos das ações adicionadas na sua lista. Por favor, chame ' +
    '"Alexa, abrir meu dividendo" e siga as instruções.',
  PERMISSION_CARD_MSG:
    'Preciso de permissão de acesso à leitura de lista. ' +
    'Para conceder essa permissão, por favor, acesse ' +
    'seu aplicativo Alexa e siga as instruções.',
  LIST_NOT_FOUND:
    'Sua lista chamada "Dividendo" não foi localizada. ' +
    'Por favor, acesse seu aplicativo Alexa, vá em "Listas e notas", ' +
    'crie uma lista com o nome "Dividendo" e adicione os códigos das ' +
    'suas ações pagadoras de dividendos, um código em cada item da lista. ',
  LIST_EMPTY:
    'Sua lista "Dividendo" foi localizada mas está vazia. ' +
    'Por favor, acesse seu aplicativo Alexa, vá em "Listas e notas" ' +
    'e adicione os códigos das suas ações pagadoras de dividendos, ' +
    'um código em cada item da lista. ',
  INVALID_TICKERS:
    'Sua lista "Dividendo" contém apenas códigos inválidos ou inexistentes ' +
    'na B3. Por favor, acesse seu aplicativo Alexa, vá em "Listas e notas" e ' +
    'verifique se os códigos das suas ações foram digitados corretamente. ' +
    'Depois tente novamente.',
  BYE_BYE: ['Até mais!', 'Tchau!', 'Até a próxima!'],
  FALLBACK:
    'Desculpe, Meu Dividendo ainda não pode fazer isso. ' +
    'Por favor, me chame novamente.',
  PROBLEM:
    'Desculpe. Ocorreu um problema ao conectar-se ao serviço. ' +
    'Por favor, aguarde um momento e tente novamente mais tarde.',
  VOICE_START: '<voice name="Ricardo">',
  VOICE_END: '</voice>',
};

module.exports = speaks;
