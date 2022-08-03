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
  next(new NotFoundError(appErrors.ERROR_PAGE_NOT_FOUND));
});

module.exports = router;
