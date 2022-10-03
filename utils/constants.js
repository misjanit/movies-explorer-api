const VALIDATION_ERROR = 400; // переданы некорректные данные
const NOTFOUND_ERROR = 404; // пользователь не найден
const SERVER_ERROR = 500; // ошибка по умолчанию
const moviesdb = 'mongodb://localhost:27017/moviesdb';

module.exports = {
  VALIDATION_ERROR,
  NOTFOUND_ERROR,
  SERVER_ERROR,
  moviesdb,
};
