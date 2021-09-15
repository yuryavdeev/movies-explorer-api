const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login, deleteAuth } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserBody, validateUserLogin } = require('../middlewares/validations');
const NotFoundError = require('../errors/not-found');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateUserLogin, login);

router.use(auth); // ниже роуты с авторизацией

router.delete('/signout', deleteAuth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => {
  const err = new NotFoundError('Страница не существует!');
  next(err);
});

module.exports = router;
