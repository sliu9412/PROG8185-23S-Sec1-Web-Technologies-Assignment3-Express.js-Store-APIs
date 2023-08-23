const jwt = require('jsonwebtoken');
const settings = require('./settings');
const AppError = require('../exception/app.exception');

const SCOPE_ADMIN = 'admin';
const SCOPE_CLIENT = 'client';

const createJwtToken = (userID, scope) => {
  const payload = {
    user: {
      id: userID,
      scope: scope,
    },
  };
  return jwt.sign(payload, settings.jwt.secret, { expiresIn: settings.jwt.expiresIn });
};

const verifyFromHttpRequest = (req) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided', 401);
    }
    return jwt.verify(token, settings.jwt.secret);
  } catch(err) {
    if (err instanceof AppError) {
      throw new AppError('Token not valid', 401).withOriginalStack(err);
    }
    throw err;
  }
}

const checkClientIDIntegrity = (req, userID) => {
  if (req.user.scope == SCOPE_CLIENT && req.user.id !== userID) {
    throw new AppError('Not Authorized', 401);
  }
}

module.exports = {
  createJwtToken,
  verifyFromHttpRequest,
  checkClientIDIntegrity,
  SCOPE_ADMIN,
  SCOPE_CLIENT,
};
