const router = require('express').Router();

const {
  createMovie,
  getMyMovies,
  deleteMovie,
} = require('../controllers/movies');

const { validateMovieBody, validateMovieDelete } = require('../middlewares/validations');

router.post('/', validateMovieBody, createMovie);
router.get('/', getMyMovies);
router.delete('/:movieId', validateMovieDelete, deleteMovie);

module.exports = router;
