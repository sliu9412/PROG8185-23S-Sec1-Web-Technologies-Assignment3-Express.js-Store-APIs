/**
 * Product Controller
 */
const express = require('express');
const router = express.Router();
const sessionMiddleware = require('../middlewares/session.middleware');
const jwtHerlper = require('../../common/jwt');
const productMiddleware = require('./product.middleware');
const productService = require('../../services/product.service');


router.post('/', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_ADMIN),
    productMiddleware.validateProductIDParam, async (req, res) => {
        const createdProduct = await productService.createProduct(req.body);
        res.status(201).json({
            message: 'Product created sucessfully',
            data: createdProduct,
        });
    });

router.put('/:productID', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_ADMIN),
    productMiddleware.validateUpdateProduct, async (req, res) => {
        const updatedProduct = await productService.updateProduct(req.params.productID, req.body);
        res.json({
            message: 'Product updated sucessfully',
            data: updatedProduct,
        });
    });

router.get('/:productID', productMiddleware.validateProductIDParam, async (req, res) => {
    const product = await productService.findProductByID(req.params.productID);
    res.json({
        message: 'Product finded sucessfully',
        data: product,
    });
});

router.delete('/:productID', sessionMiddleware.validateToken, sessionMiddleware.checkScope(jwtHerlper.SCOPE_ADMIN),
    productMiddleware.validateProductIDParam, async (req, res) => {
        const product = await productService.findProductByIDAndDelete(req.params.productID);
        res.json({
            message: 'Product deleted sucessfully',
            data: product,
        });
    });

router.get('/', async (req, res) => {
    const products = await productService.findAllProducts();
    res.json({
        message: 'Producs listed sucessfully',
        data: products,
    });
});

module.exports = router;
