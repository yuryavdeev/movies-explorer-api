const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 8)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send(user)) // или перечислить поля без password
    .catch((err) => {
      if (err.code === 11000) {
        const error = new Error('Пользователь с таким e-mail уже существует!');
        error.statusCode = 409;
        next(error);
      } else if (err.name === 'ValidationError') {
        const error = new BadRequestError(
          err.errors.email ? err.errors.email.message : 'Переданы некорректные данные при создании пользователя!',
        );
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res
        // метод express'а установки куков: имя - строка, значение - созданный токен:
        .cookie('token', token, { // попадет в заголовок Cookies
          maxAge: 3600000 * 24 * 7, // иначе после закр-я сессии - удалится
          httpOnly: true, // исключили доступ из JS в браузере
          // sameSite: true, // отпр. кук - если запрос с этого-же домена
          sameSite: 'None',
          // secure: true, // веб-сайт с поддержкой https - после деплоя
        })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(next);
};

module.exports.deleteAuth = (req, res) => {
  res
    .clearCookie('token', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'None',
      // secure: true,
    })
    .send({ message: 'Авторизация отменена!' });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден!');
    })
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден!');
    })
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        const error = new Error('Пользователь с таким e-mail уже существует!');
        error.statusCode = 409;
        next(error);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequestError(
          err.errors.email ? err.errors.email.message : 'Переданы некорректные данные!',
        );
        next(error);
      } else {
        next(err);
      }
    });
};
