const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUser, updateUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = router;
