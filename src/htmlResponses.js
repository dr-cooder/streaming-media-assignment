const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const client2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const client3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

const loadPage = (request, response, file) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(file);
  response.end();
};

const getIndex = (request, response) => {
  loadPage(request, response, index);
};

const getClient2 = (request, response) => {
  loadPage(request, response, client2);
};

const getClient3 = (request, response) => {
  loadPage(request, response, client3);
};

module.exports = {
  getIndex,
  getClient2,
  getClient3,
};
