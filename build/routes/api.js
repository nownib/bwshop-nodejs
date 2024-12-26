"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _userController = _interopRequireDefault(require("../controller/userController"));
var _productController = _interopRequireDefault(require("../controller/productController"));
var _cartController = _interopRequireDefault(require("../controller/cartController"));
var _blogController = _interopRequireDefault(require("../controller/blogController"));
var _wishlistController = _interopRequireDefault(require("../controller/wishlistController"));
var _contactController = _interopRequireDefault(require("../controller/contactController"));
var _addressController = _interopRequireDefault(require("../controller/addressController"));
var _couponController = _interopRequireDefault(require("../controller/couponController"));
var _passport = _interopRequireDefault(require("passport"));
var _JWTAction = require("../middleware/JWTAction");
var _multer = _interopRequireDefault(require("multer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
var upload = (0, _multer["default"])({
  dest: "uploads/"
});
var initApiRoutes = function initApiRoutes(app) {
  router.all("*", _JWTAction.checkUserJWT);
  //user
  router.post("/register", _userController["default"].handleRegisterUser);
  router.post("/login", _userController["default"].handleLogin);
  router.get("/account", _userController["default"].getUserAccount);
  router.get("/logout", _userController["default"].handleLogout);
  router.put("/account/update", _userController["default"].updateAccount);
  router.post("/account/upload-image", upload.single("file"), _userController["default"].uploadImage);
  router.post("/send-email", _userController["default"].sendEmail);
  router.post("/reset-password", _userController["default"].handleResetPassword);
  // Social authentication
  router.get("/auth/google", _passport["default"].authenticate("google", {
    scope: ["profile", "email"]
  }));
  router.get("/google/redirect", _passport["default"].authenticate("google", {
    failureRedirect: "".concat(process.env.URL_REACT, "/login")
  }), function (req, res) {
    var user = req.user;
    res.cookie("jwt", user.token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000
    });
    res.redirect("".concat(process.env.URL_REACT, "/google/redirect?token=").concat(user.token));
  });
  //product
  router.get("/product/trend", _productController["default"].readProductTrending);
  router.get("/category/read", _productController["default"].readCategory);
  router.get("/product/read", _productController["default"].readProduct);
  router.get("/product/read-details/:productId", _productController["default"].readProductDetails);
  //rating
  router.post("/product/review", _productController["default"].handleUpSertReview);
  router.get("/product/read-review/:productId", _productController["default"].readReview);
  router.get("/product/read-rating-by-star/:productId", _productController["default"].readRatingsByStar);
  //cart
  router.get("/cart/read", _cartController["default"].readCart);
  router.post("/cart/add-product-to-cart", _cartController["default"].handleAddProduct);
  router.post("/cart/update-cart", _cartController["default"].handleUpdateProduct);
  router.post("/cart/delete", _cartController["default"].handleDeleteProduct);
  router.post("/cart/clear", _cartController["default"].handleClearCart);
  //coupon
  router.post("/coupon/apply", _couponController["default"].handleApplyCoupon);
  //address
  router.get("/address/province", _addressController["default"].readProvinces);
  router.post("/address/district", _addressController["default"].readDistricts);
  router.post("/address/wards", _addressController["default"].readWards);
  router.post("/address/create", _addressController["default"].createAddress);
  router.post("/address/update", _addressController["default"].updateAddress);
  router.get("/address/read-address", _addressController["default"].readAddress);
  router["delete"]("/address/delete/:id", _addressController["default"].deleteAddress);
  //order
  router.post("/order/create", _cartController["default"].handleCreateOrder);
  router.get("/order/read", _cartController["default"].readOrder);
  router.post("/order/details", _cartController["default"].readOrderDetails);
  //wishlist
  router.get("/wishlist/read", _wishlistController["default"].readWishlist);
  router.post("/wishlist/add-to-wishlist", _wishlistController["default"].handleAddProduct);
  router.post("/wishlist/delete", _wishlistController["default"].handleDeleteProduct);

  //blog
  router.get("/blog/read", _blogController["default"].readBlog);
  //contact
  router.post("/contact/add", _contactController["default"].handleAddContact);
  return app.use("/api/", router);
};
var _default = exports["default"] = initApiRoutes;