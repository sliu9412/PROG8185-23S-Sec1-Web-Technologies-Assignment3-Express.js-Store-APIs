/**
 * Session Middleware
 */
const jwtHelper = require('../../common/jwt');
const AppError = require('../../exception/app.exception');
const userService = require('../../services/user.service');

const validateToken = async (req, res, next) => {
    try {
        const decodedToken = jwtHelper.verifyFromHttpRequest(req);
        // attach user to the request object
        req.user = decodedToken.user;
        if (req.user.scope == jwtHelper.SCOPE_CLIENT) {
            // attach database user information to the request object
            userService.findUserByID(req.user.id)
                .then(dbUser => {
                    req.dbUser = dbUser;
                    next();
                })
                .catch(next);
        } else {
            next();
        }
    } catch(err) {
        next(err);
    }
}

const checkScope = (scope) => {
    return (req, res, next) => {
      if (!req.user || !req.user.scope || !req.user.scope.includes(scope)) {
        throw new AppError('Insufficient scope', 403);
      }
      next();
    };
}

module.exports = {
    validateToken,
    checkScope,
};
