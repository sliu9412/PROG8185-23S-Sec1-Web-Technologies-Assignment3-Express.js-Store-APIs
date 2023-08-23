/**
 * Project Entry Point.
 */
const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const settings = require('./src/common/settings');
const globalErrorHandler = require('./src/apis/middlewares/exception.middleware');
const authController = require('./src/apis/auth/authentication.controller');
const userController = require('./src/apis/user/user.controller');
const productController = require('./src/apis/product/product.controller');
const shoppingCartController = require('./src/apis/shopping/shopping.controller');
const reviewController = require('./src/apis/review/review.controller');

const app = new express();

// database connection
const dataBaseURL = `${settings.database.url}/${settings.database.dbName}`;
console.log(`Connecting to '${dataBaseURL}'`);
mongoose.connect(dataBaseURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: settings.database.username,
    pass: settings.database.password,
  }
);

// this event will be emitted one time when database is established
mongoose.connection.on('open', () => {
  console.log('Database connection was established');
  console.log('API starting');

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // APIS definition
  app.use('/api/auth', authController);
  app.use('/api/user', userController);
  app.use('/api/product', productController);
  app.use('/api/shopping', shoppingCartController);
  app.use('/api/review', reviewController);

  // Global exception handler middleware
  app.use((err, req, res, next) => {
    globalErrorHandler(err, req, res, next);
  });
  // listen on localhost port
  app.listen(settings.server.port, settings.server.host, () => {
    console.log(`API is running on PORT ${settings.server.port}`);
  });
});

// This code let close the database connection when APP is shutting down.
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed due to application termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing Database connection:', err.message);
    process.exit(1);
  }
});



