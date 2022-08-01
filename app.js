const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');

// errors
const { errors } = require('celebrate');
const appErrors = require('./errors/app-errors');
const NotFoundError = require('./errors/not-found-error');

// middlewares
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/request-logger');
const { authorize } = require('./middlewares/auth');

// controllers
const { login, createUser } = require('./controllers/users');

// routes
const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true });

app.use(requestLogger);

// роуты авторизации и создания нового пользователя
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// защита роутов авторизацией
app.use(authorize);

// роуты
app.use('/users', usersRoutes);
app.use('/movies', moviesRoutes);

app.use(errorLogger);
app.use(errors());

app.use((req, res, next) => {
  Promise.reject(new NotFoundError(appErrors.ERROR_BAD_REQUEST))
    .catch(next);
});

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => { });
