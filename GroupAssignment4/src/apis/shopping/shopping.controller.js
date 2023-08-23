/**
 * Product Controller
 */
const express = require('express');
const router = express.Router();
const sessionMiddleware = require('../middlewares/session.middleware');
const jwtHerlper = require('../../common/jwt');
const shoppingMiddleware = require('./shopping.middleware');
const shoppingService = require('../../services/shopping.service');

router.post('/cart', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_CLIENT),
    shoppingMiddleware.validateShoppingCart, async (req, res) => {
        let cartItem = await shoppingService.addRemoveItem(req.user.id, req.body.productID, req.body.quantity);
        let message = 'Shopping Cart Item Updated';
        if (cartItem.quantity == 0) {
            message = 'Shopping Cart Item Deleted';
            cartItem = null;
        }
        res.json({
            message,
            data: cartItem,
        });
    });

router.get('/cart', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_CLIENT), async (req, res) => {
    let userCart = await shoppingService.getShoppingCart(req.user.id);
    res.json({
        message: 'User Shooping Cart',
        data: userCart,
    });
});

router.post('/purchase', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_CLIENT), async (req, res) => {
    let purchasedOrder = await shoppingService.purchaseCart(req.user.id);
    res.json({
        message: 'User Purchased Order Succesfully',
        data: purchasedOrder,
    });
});

router.get('/purchase', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_CLIENT), async (req, res) => {
    let purchasedOrders = await shoppingService.getPurchasedOrderByUserID(req.user.id);
    res.json({
        message: 'User Purchased Order History',
        data: purchasedOrders,
    });
});

router.get('/purchase/:transactionID', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_CLIENT), async (req, res) => {
    let purchasedOrder = await shoppingService.getPurchasedOrderByUserID(req.user.id);
    res.json({
        message: 'User Purchased Order Detail',
        data: purchasedOrder,
    });
});

module.exports = router;