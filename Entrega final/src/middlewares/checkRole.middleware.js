import config from '../config.js';

function isAdmin(req, res, next) {
  if (req.user.role === 'ADMIN') {
    next();
  } else {
    res.redirect(config.URL_FRONTEND);
  }
}

export default isAdmin;
