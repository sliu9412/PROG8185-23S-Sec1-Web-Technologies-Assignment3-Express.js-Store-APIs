/**
 * Order Model
 */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    transactionID: {
        type: String,
        required: true,
    },
    productID: {
        type: String,
        required: true,
    },
    productTotalPrice: {
        type: Number,
        required: true,
    },
    productQuantity: {
        type: Number,
        required: true,
    },
    productTotalTaxes: {
        type: Number,
        required: true,
    },
    productTotalShippingCost: {
        type: Number,
        required: true,
    },
    productImage: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productShippingCost: {
        type: Number,
        required: true,
    }
});

// Create a compound index on userID, transactionID, and productID
orderSchema.index({ userID: 1, transactionID: 1, productID: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
