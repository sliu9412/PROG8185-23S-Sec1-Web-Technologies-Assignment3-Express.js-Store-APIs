/**
 * User Controller
 */
const express = require('express');
const router = express.Router();
const userMiddlewares = require('./user.middleware');
const sessionMiddleware = require('../middlewares/session.middleware');
const jwtHerlper = require('../../common/jwt');
const userService = require('../../services/user.service');

router.post('/', userMiddlewares.validateCreate, async (req, res) => {
    const createdUser = await userService.createUser(req.body);
    createdUser.password = '***';
    res.status(201).json({
        message: 'User created sucessfully',
        data: createdUser,
    });
});

router.put('/:userID', sessionMiddleware.validateToken, userMiddlewares.validateUpdate, async (req, res) => {
    const userID = req.params.userID;
    jwtHerlper.checkClientIDIntegrity(req, userID);
    const updatedUser = await userService.updateUser(userID, req.body);
    updatedUser.password = '***';
    res.json({
        message: 'User updated sucessfully',
        data: updatedUser,
    });
});

router.get('/:userID', sessionMiddleware.validateToken, userMiddlewares.validateUserIDParam, async (req, res) => {
    const userID = req.params.userID;
    jwtHerlper.checkClientIDIntegrity(req, userID);
    const findedUser = await userService.findUserByID(userID);
    findedUser.password = '***';
    res.json({
        message: 'Users finded sucessfully',
        data: findedUser,
    });
});

router.get('/', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_ADMIN), async (req, res) => {
    const allUsers = await userService.findAllUsers();
    allUsers.forEach(u => {
        u.password = '***';
    });
    res.json({
        message: 'User listed sucessfully',
        data: allUsers,
    });
});

router.delete('/:userID', sessionMiddleware.validateToken, userMiddlewares.validateUserIDParam, async (req, res) => {
        const userID = req.params.userID;
        jwtHerlper.checkClientIDIntegrity(req, userID);
        const findedUser = await userService.findUserByIDAndDelete(userID);
        findedUser.password = '***';
        res.json({
            message: 'Users deleted sucessfully',
            data: findedUser,
        });
    });

module.exports = router;