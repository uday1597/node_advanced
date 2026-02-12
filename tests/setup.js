jest.setTimeout(30000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');
const app = require('../app');     // 👈 IMPORT APP
const http = require('http');

let server;

mongoose.Promise = global.Promise;

beforeAll(async () => {
  await mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // 🔥 START EXPRESS SERVER
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(3000, resolve);
  });
});

afterAll(async () => {
  await mongoose.disconnect();

  // 🔥 STOP SERVER
  await new Promise((resolve) => server.close(resolve));
});
