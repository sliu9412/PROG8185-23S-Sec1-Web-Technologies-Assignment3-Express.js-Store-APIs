/**
 * Review Model.
 */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  images: {
    type: [String],
    default: [],
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;