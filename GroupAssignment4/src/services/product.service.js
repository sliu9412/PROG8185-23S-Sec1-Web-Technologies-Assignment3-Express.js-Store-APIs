/**
 * Product business service logic
 */
const Product = require('../models/product.model');
const AppError = require('../exception/app.exception');

// Create new product
const createProduct = async (productData) => {
    try {
        const { name, description, image, price, shippingCost } = productData;
        const newProduct = new Product({
            name,
            description,
            image,
            price,
            shippingCost,
        });
        await newProduct.save();
        return newProduct;
    } catch (err) {
        throw new AppError('Error creating product', 500).withOriginalStack(err);
    }
}

// Update an existing product
const updateProduct = async (productID, productData) => {
    const actualProduct = await findProductByID(productID);
    try {
        const { name, description, image, price, shippingCost } = productData;
        // Update the product data
        actualProduct.name = name;
        actualProduct.description = description;
        actualProduct.image = image;
        actualProduct.price = price;
        actualProduct.shippingCost = shippingCost;
        await actualProduct.save();
        return actualProduct;
    } catch (err) {
        throw new AppError('Error updating product', 500).withOriginalStack(err);
    }
}

// Search a product using id
const findProductByID = async (productID) => {
    const product = await Product.findById(productID);
    try{
    if (!product) {
      throw new AppError('Product not found', 404);
    }
        return product;
    } catch{
        throw new AppError('Error finding product', 500).withOriginalStack(err);
    }}

// Delete a product using id
const findProductByIDAndDelete = async (productID) => {
    const product = await Product.findByIdAndDelete(productID);
    try{
    if (!product) {
      throw new AppError('Product not found', 404);
    }
        return product;
    } catch{
        throw new AppError('Error finding product', 500).withOriginalStack(err);
    }}

// List all products
const findAllProducts = async () => {
    return Product.find();
}

module.exports = {
    createProduct,
    findProductByID,
    updateProduct,
    findProductByIDAndDelete,
    findAllProducts,
};
