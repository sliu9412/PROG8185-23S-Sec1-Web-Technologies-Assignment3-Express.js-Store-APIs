/**
 * Product Review business logic.
 */
const AppError = require('../exception/app.exception');
const shoppingService = require('./shopping.service');
const productService = require('./product.service');
const Review = require('../models/review.model');

const makeReview = async (userDB, productID, reviewData) => {
    // validate if product exsits
    const product = await productService.findProductByID(productID);
    // validate if user has a purchase item related to the product
    const purchases = await shoppingService.getPurchasedOrderByUserIdAndProductID(userDB._id.toString(), productID);
    if (!purchases || purchases.length == 0) {
        throw new AppError('User not alowed to make reviews because does not have any order related to this product.', 401);
    }
    const newReview = new Review({
        productID,
        userID: userDB._id,
        username: userDB.username,
        comment: reviewData.comment,
        rating: reviewData.rating,
        images: reviewData.images,
    });
    return await newReview.save();
}

const deleteReview = async (userDB, reviewID) => {
    const existingReview = await Review.findById(reviewID);
    if (!existingReview) {
        throw new AppError('Review does not exist.', 404);
    }
    if (existingReview.userID !== userDB._id.toString()) {
        throw new AppError('User not allowed to delete this review.', 401);
    }
    return await Review.findByIdAndDelete(reviewID);
}

const getProductReviewsByProductID = async (productID) => {
    const pipeline = [
        { $match: { productID } },

        // Group reviews by productID
        {
            $group: {
                _id: '$productID', // Group by productID
                reviews: { $push: '$$ROOT' }, // Store the matching documents in the 'reviews' array
                averageRating: { $avg: '$rating' }, // Calculate the average of the ratings
            },
        },
    ];
    return await Review.aggregate(pipeline);
}

module.exports = {
    makeReview,
    deleteReview,
    getProductReviewsByProductID
}
