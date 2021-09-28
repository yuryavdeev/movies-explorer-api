// Значение для заголовка Access-Control-Allow-Methods
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://avdeev.movies.nomoredomains.monster',
  'http://avdeev.movies.nomoredomains.monster',
  'http://localhost:3000',
  'http://localhost:3001',
];

function cors(req, res, next) {
  // const cors = (req, res, next) => {
  const { origin } = req.headers; // источник запроса - в переменную origin
  const { method } = req; // тип запроса в переменную method
  const requestHeaders = req.headers['access-control-request-headers']; // сохр. список «небезоп-х» заголовков осн. запроса

  if (allowedCors.includes(origin)) {
    // уст. заголовок, который разрешает браузеру запросы с этого источника
    // console.log(origin);
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  // предварительный запрос? - добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими «небезопасными» (requestHeaders) заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  return next();
}

module.exports = { cors };
