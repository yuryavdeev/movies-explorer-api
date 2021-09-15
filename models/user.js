const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  email: {
    type: String,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неправильный формат почты',
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    // select: false, // => хеш пароля не долж. возвр. из базы (не работает с create, только - find)
  },
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password; // или в контроллере возвращать без пароля
  return obj;
};

// проверка почты и пароля - часть схемы User; добавить свой метод - в св-во statics схемы
userSchema.statics.findUserByCredentials = function (email, password) {
  if (!password || password.length < 6) { // на роуте /signin
    throw new UnauthorizedError('Почта или пароль введены неправильно!');
  }
  // нужен хеш пароля => после вызова метода модели - добав. метод select и строку +password:
  return this.findOne({ email }).select('+password') // this - модель User
    .orFail(() => {
      throw new UnauthorizedError('Почта или пароль введены неправильно!');
    })
    .then((user) => bcrypt.compare(password, user.password) // сравн. пароль и хеш в базе
      .then((matched) => { // вложен в 1-й .then
        if (!matched) {
          throw new UnauthorizedError('Почта или пароль введены неправильно!');
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
