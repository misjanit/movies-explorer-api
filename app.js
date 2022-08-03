const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const router = require('./routes');
const limiter = require('./middlewares/limiter');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/request-logger');
const { moviesdb } = require('./utils/constants');

const { PORT = 3000, DB_CONN, NODE_ENV } = process.env;
const app = express();

app.use(cors);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(NODE_ENV === 'production' ? DB_CONN : moviesdb);

app.use(limiter);
app.use(errors());
app.use(router);
app.use(requestLogger);
app.use(errorLogger);
app.listen(PORT, () => { });
