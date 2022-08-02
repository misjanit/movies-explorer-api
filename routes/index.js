const router = require('express').Router();
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const { authorize } = require('../middlewares/auth');
const auth = require('./auth');
const appErrors = require('../errors/app-errors');
const NotFoundError = require('../errors/not-found-error');

router.use('/', auth); // роут логина и регистрации
router.use(authorize); // защита роутов авторизацией
router.use('/users', usersRoutes);
router.use('/movies', moviesRoutes);

router.use((req, res, next) => {
  Promise.reject(new NotFoundError(appErrors.ERROR_BAD_REQUEST))
    .catch(next);
});

// Централизованный обработчик ошибок
router.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

module.exports = router;
