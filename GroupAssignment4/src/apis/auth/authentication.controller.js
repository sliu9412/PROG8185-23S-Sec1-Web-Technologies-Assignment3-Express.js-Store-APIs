/**
 * User Controller
 */
const express = require('express');
const router = express.Router();
const jwtHelper = require('../../common/jwt');
const authMiddleware = require('./authentication.middleware');
const userService = require('../../services/user.service');

router.post('/login', authMiddleware.validateLogin, async (req, res) => {
    const findedUser = await userService.findByUsernameAndPassword(req.body.username, req.body.password);
    findedUser.password = '***';
    const data = {
        user: findedUser,
        token: jwtHelper.createJwtToken(findedUser._id, jwtHelper.SCOPE_CLIENT),
    }
    res.status(201).json({
        message: 'User authenticated sucessfully',
        data,
    });
});

router.post('/admin/login', authMiddleware.validateLogin, async (req, res) => {
    if (req.body.username == 'admin' && req.body.password == '123') {
        const data = {
            user: {
                admin: req.body.username
            },
            token: jwtHelper.createJwtToken('administrator1', jwtHelper.SCOPE_ADMIN),
        }
        res.status(201).json({
            message: 'Admin authenticated sucessfully',
            data,
        });
    }
    else {
        res.status(401).json({
            message: 'Admin authentication fail'
        });
    }
});

module.exports = router;
