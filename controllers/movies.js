const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, id, nameRU, nameEN,
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
    id,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('Некорректные данные при добавлении фильма!');
        next(error);
      } else if (err.code === 11000) {
        const error = new Error('Этот фильм уже добавлен!');
        error.statusCode = 409;
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.getMyMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.id })
    .orFail(() => {
      throw new NotFoundError('Фильм для удаления не найден!');
    })
    .then((movie) => {
      const movieOwnerId = String(movie.owner);
      if (movieOwnerId !== req.user._id) {
        const err = new ForbiddenError('Нет доступа!');
        next(err);
      } else {
        movie.remove()
          .then(() => res.send(movie))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError('Переданы некорректные данные при удалении фильма!');
        next(error);
      } else {
        next(err);
      }
    });
};
