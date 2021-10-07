const { celebrate, Joi } = require('celebrate');
const { checkUrl } = require('../utils/utils');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .pattern(new RegExp('^[a-zа-яё\\-\\s]{2,30}$', 'i'))
      .message('Поле "name" невалидно'),
    email: Joi.string().required().email()
      .message('Поле "email" невалидно'),
    password: Joi.string().required().min(6)
      .message('Поле "password" невалидно'),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле "email" или "password" невалидно'),
    password: Joi.string().required().min(6)
      .message('Поле "email" или "password" невалидно'),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .pattern(new RegExp('^[a-zа-яё\\-\\s]{2,30}$', 'i'))
      .message('Поле "name" невалидно'),
    email: Joi.string().required().email()
      .message('Поле "email" невалидно'),
  }),
});

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(checkUrl),
    trailerLink: Joi.string().required().custom(checkUrl),
    thumbnail: Joi.string().required().custom(checkUrl),
    id: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieDelete = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validateUserBody, validateUserLogin, validateUserUpdate, validateMovieBody, validateMovieDelete,
};
