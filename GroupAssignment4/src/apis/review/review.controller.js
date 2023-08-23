/**
 * Review Controller
 */
const express = require('express');
const router = express.Router();
const sessionMiddleware = require('../middlewares/session.middleware');
const jwtHerlper = require('../../common/jwt');
const reviewMiddleware = require('./review.middleware');
const reviewService = require('../../services/review.service');

router.post('/:productID', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_CLIENT),
    reviewMiddleware.validateReviewFields, async (req, res) => {
        const makedReview = await reviewService.makeReview(req.dbUser, req.params.productID, req.body);
        res.json({
            message: 'Product Review Submitted',
            data: makedReview,
        });
    });

router.delete('/:reviewID', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_CLIENT), async (req, res) => {
    const deletedReview = await reviewService.deleteReview(req.dbUser, req.params.reviewID);
    res.json({
        message: 'Product Review Deleted',
        data: deletedReview,
    });
});

router.get('/:productID', async (req, res) => {
    const productReviews = await reviewService.getProductReviewsByProductID(req.params.productID);
    res.json({
        message: 'Product Reviews',
        data: productReviews,
    });
});

module.exports = router;
