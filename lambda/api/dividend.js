const axios = require('axios');

function getResponse(body) {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.URL_API_DINFO, body)
      .then(response => {
        if (response.data.status !== 'OK') {
          reject(Error('"status" is not OK'));
        }

        resolve(response.data);
      })
      .catch(error => {
        if (error.response) {
          reject(Error(`HTTP status code <${error.response.status}>`));
        }

        reject(error);
      });
  });
}

module.exports.getInfo = async itemsRequest => {
  let response = null;

  try {
    response = await getResponse(itemsRequest);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Dividend.getInfo - ${error}`);
  }

  return response;
};
