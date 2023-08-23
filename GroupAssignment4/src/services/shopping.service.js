/**
 * Shopping Service business logic.
 */
const productService = require('./product.service');
const AppError = require('../exception/app.exception');
const ShoppingCart = require('../models/shoppingcart.model');
const Order = require('../models/order.model');
const settings = require('../common/settings');
const { v4: uuidv4 } = require('uuid');

const getShoppingCart = async (userID) => {
    let userCartItems = await ShoppingCart.find({ userID }).populate('productID');
    if (!userCartItems) {
        throw new AppError('User does not have a shopping cart', 404);
    }
    const userCart = {
        totalPrice: 0,
        totalQuantity: 0,
        totalShippingCost: 0,
        totalTaxes: 0,
        items: [],
    };
    for (const productItem of userCartItems) {
        const productTotalPrice = (productItem.quantity * productItem.productID.price);
        const cartItem = {
            totalPrice: Number(productTotalPrice.toFixed(2)),
            quantity: productItem.quantity,
            totalTaxes: Number((productTotalPrice * settings.pricing.taxes).toFixed(2)),
            totalShippingCost: Number(productItem.productID.shippingCost.toFixed(2)),
            product: productItem.productID,
        };
        userCart.totalPrice += cartItem.totalPrice;
        userCart.totalQuantity += cartItem.quantity;
        userCart.totalShippingCost += cartItem.shippingCost;
        userCart.totalTaxes += cartItem.totalTaxes;
        userCart.items.push(cartItem);
    }
    return userCart;
}

const purchaseCart = async (userID) => {
    const userCart = await getShoppingCart(userID);
    const transactionID = uuidv4();
    for (const cartItem of userCart.items) {
        const newOrder = new Order({
            userID,
            transactionID,
            productID: cartItem.product._id,
            productTotalPrice: cartItem.totalPrice,
            productQuantity: cartItem.quantity,
            productTotalTaxes: cartItem.totalTaxes,
            productTotalShippingCost: cartItem.totalShippingCost,
            productImage: cartItem.product.image,
            productName: cartItem.product.name,
            productDescription: cartItem.product.description,
            productPrice: cartItem.product.price,
            productShippingCost: cartItem.product.shippingCost,
        });
        await newOrder.save();
    }
    await ShoppingCart.deleteMany({ userID });
    return await getPurchasedOrderByUserIdAndtrxId(userID, transactionID);
}

const getPurchasedOrderByUserID = async (userID) => {
    return privateGetPurchasedOrders({ userID });
}

const getPurchasedOrderByUserIdAndProductID = async (userID, productID) => {
    return privateGetPurchasedOrders({ userID, productID });
}

const getPurchasedOrderByUserIdAndtrxId = async (userID, transactionID) => {
    return privateGetPurchasedOrders({ userID, transactionID });
}

const addRemoveItem = async (userID, productID, quantity) => {
    const product = await productService.findProductByID(productID);
    let dbCartItem = await createOrUpdateItem(userID, productID, quantity);
    if (quantity == 0) {
        dbCartItem = await findByIdAndDelete(dbCartItem._id);
    }
    return getShoppingCart(userID);
}

const createOrUpdateItem = async (userID, productID, quantity) => {
    let itemExists = await ShoppingCart.findOne({ userID, productID });
    if (!itemExists) {
        itemExists = new ShoppingCart({
            productID,
            userID,
            quantity,
        });
    }
    itemExists.quantity = quantity;
    await itemExists.save();
    return itemExists;
}

const findByIdAndDelete = async (cartID) => {
    return await ShoppingCart.findByIdAndDelete(cartID);
}

const privateGetPurchasedOrders = async (filters) => {
    const pipeline = [
        { $match: filters },
        // Group orders by transactionID
        {
            $group: {
                _id: '$transactionID', // Group by transactionID
                orders: { $push: '$$ROOT' }, // Store the matching documents in the 'orders' array
            },
        },
    ];
    const aggregatedOrders = await Order.aggregate(pipeline);
    return aggregatedOrders;
}

module.exports = {
    addRemoveItem,
    getShoppingCart,
    purchaseCart,
    getPurchasedOrderByUserID,
    getPurchasedOrderByUserIdAndtrxId,
    getPurchasedOrderByUserIdAndProductID,
};