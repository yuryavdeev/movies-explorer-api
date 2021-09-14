const express = require('express');
require('dotenv').config(); // env-переменные из файла .env добавил в process.env
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');
const { handleError } = require('./errors/err');
const { limiter } = require('./middlewares/limiter');

const {
  PORT = 3000,
  LOCAL_DB = 'mongodb://localhost:27017/moviesdb',
} = process.env; // в переменную окружения

const app = express();

app.use(requestLogger); // логгер запросов - до лимитера и обработчика роутов
app.use(limiter);
app.use(cookieParser()); // => токен в req.cookies.token
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet()); // заголовки безопасности - проставить автоматически

mongoose.connect(LOCAL_DB); // версия 6 => убрал объект опций

app.use(cors);
app.use(router);
app.use(errorLogger); // логгер ошибок - после роутов, до обработчиков ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(handleError); // единый обработчик

// app.listen(PORT, () => {
//   console.log(`порт на ${(PORT)}`);
// });

app.listen(PORT);
