const Movie = require('../models/movie');
const appErrors = require('../errors/app-errors');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const DeleteError = require('../errors/delete-error');

// Возвращает все сохраненные текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

// Создание фильма с переданными в теле параметрами
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailerLink, thumbnail,
    movieId, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailerLink: movie.trailerLink,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      _id: movie._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(appErrors.ERROR_INCORRECT_NEW_MOVIE_PARAMS));
      } else {
        next(err);
      }
    });
};

// Удаление фильма из избранного
module.exports.deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(appErrors.ERROR_MOVIE_NOT_FOUND);
      }
      if (userId !== movie.owner.toString()) {
        throw new DeleteError(appErrors.ERROR_DELETE_NOT_OWNER);
      } else {
        Movie.findByIdAndRemove(movieId)
          .then((result) => res.send(result))
          .catch(next);
      }
    })
    .catch(next);
};
