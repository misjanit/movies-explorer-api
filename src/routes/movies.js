const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexpLink } = require('../utils/constants');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

// возвращает все сохраненные текущим пользователем фильмы
router.get('/', getMovies);

// создает фильм с переданными в теле параметрами
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regexpLink),
    trailerLink: Joi.string().required().pattern(regexpLink),
    thumbnail: Joi.string().required().pattern(regexpLink),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

// удаляет сохраненный фильм по id
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
