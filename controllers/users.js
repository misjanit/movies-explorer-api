const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const appErrors = require('../errors/app-errors');
const AuthError = require('../errors/auth-error');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const EmailError = require('../errors/email-error');

// Возвращает информацию о пользователе (email и имя)
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(appErrors.ERROR_USER_NOT_FOUND);
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(appErrors.ERROR_INCORRECT_USER_ID);
      }
      return next(err);
    })
    .catch(next);
};

// Обновляет информацию о пользователе (email и имя)
module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(appErrors.ERROR_USER_NOT_FOUND);
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(appErrors.ERROR_INCORRECT_NEW_USER_PARAMS));
      } if (err.codeName === 'DuplicateKey') {
        next(new EmailError(appErrors.ERROR_EMAIL_ALREADY_USED));
      } else {
        next(err);
      }
    });
};

// Создать пользователя (регистрация)
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new EmailError(appErrors.ERROR_EMAIL_ALREADY_USED));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(appErrors.ERROR_INCORRECT_EDIT_PARAMS));
      }
      return next(err);
    });
};

// Логин
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        { expiresIn: '7d' },
      );
      res.send({ token, email });
    })
    .catch(() => {
      throw new AuthError(appErrors.ERROR_LOGIN);
    })
    .catch(next);
};
