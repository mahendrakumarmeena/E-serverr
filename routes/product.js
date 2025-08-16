const express = require('express');

const app = express.Router();
const { isAuthenticated, isAdmin } = require('../middlerware/auth');
const { uploadProduct, getProducts, updateProduct, getCategoryProduct, getSingleCategoryProduct, getProductDetails, searchProduct, filterProduct } = require('../controller/Product');
const { addToCartProduct, countAddedProductinCart, cartProductView, upadateCart, removetCartProduct } = require('../controller/cart');




app.post("/upload-product",isAuthenticated, isAdmin, uploadProduct);
app.get("/get-product", getProducts);
app.post("/update-product/:productId", isAuthenticated, isAdmin, updateProduct);
app.get("/get-CategoryProduct",  getCategoryProduct);
app.post("/get-Single-category-product", getSingleCategoryProduct);
app.post("/get-product-details", getProductDetails);
app.get("/search", searchProduct);
app.post("/filter-product", filterProduct);


app.post("/addtocart", addToCartProduct);
app.get("/countProduct", countAddedProductinCart);
app.get("/view-cart-product", cartProductView);
app.post("/update-cart-product", upadateCart);
app.post("/remove-item", removetCartProduct);

module.exports = app;