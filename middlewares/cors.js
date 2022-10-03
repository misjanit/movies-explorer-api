const allowedUrls = [
  'http://praktikum.tk',
  'https://praktikum.tk',
  'http://kinosite.api.nomoredomains.xyz',
  'https://kinosite.api.nomoredomains.xyz',
  'http://kinosite.nomoredomains.xyz',
  'https://kinosite.nomoredomains.xyz',
  'http://localhost:3000',
  'localhost:3000',
  'localhost:3001',
  'http://localhost:3001',
];

module.exports.cors = (req, res, next) => {
  const { origin } = req.headers;

  res.header('Access-Control-Allow-Credentials', 'true');

  if (allowedUrls.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req;

  const allowedMethods = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Methods', allowedMethods);
    return res.end();
  }

  return next();
};
