import express from "express";
import userController from "../controller/userController";
import productController from "../controller/productController";
import cartController from "../controller/cartController";
import blogController from "../controller/blogController";
import wishlistController from "../controller/wishlistController";
import contactController from "../controller/contactController";
import addressController from "../controller/addressController";
import couponController from "../controller/couponController";
import passport from "passport";
import { checkUserJWT } from "../middleware/JWTAction";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const initApiRoutes = (app) => {
  router.all("*", checkUserJWT);
  //user
  router.post("/register", userController.handleRegisterUser);
  router.post("/login", userController.handleLogin);
  router.get("/account", userController.getUserAccount);
  router.get("/logout", userController.handleLogout);
  router.put("/account/update", userController.updateAccount);
  router.post(
    "/account/upload-image",

    upload.single("file"),
    userController.uploadImage
  );
  router.post("/send-email", userController.sendEmail);
  router.post("/reset-password", userController.handleResetPassword);
  // Social authentication
  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/google/redirect",
    passport.authenticate("google", {
      failureRedirect: `${process.env.URL_REACT}/login`,
    }),
    (req, res) => {
      const user = req.user;
      res.cookie("jwt", user.token, {
        httpOnly: true,
        maxAge: 1 * 60 * 60 * 1000,
      });
      res.redirect(
        `${process.env.URL_REACT}/google/redirect?token=${user.token}`
      );
    }
  );
  //product
  router.get("/product/trend", productController.readProductTrending);
  router.get("/category/read", productController.readCategory);
  router.get("/product/read", productController.readProduct);
  router.get(
    "/product/read-details/:productId",
    productController.readProductDetails
  );
  //rating
  router.post(
    "/product/review",

    productController.handleUpSertReview
  );
  router.get("/product/read-review/:productId", productController.readReview);

  router.get(
    "/product/read-rating-by-star/:productId",
    productController.readRatingsByStar
  );
  //cart
  router.get("/cart/read", cartController.readCart);
  router.post(
    "/cart/add-product-to-cart",

    cartController.handleAddProduct
  );
  router.post(
    "/cart/update-cart",

    cartController.handleUpdateProduct
  );
  router.post("/cart/delete", cartController.handleDeleteProduct);
  router.post("/cart/clear", cartController.handleClearCart);
  //coupon
  router.post(
    "/coupon/apply",

    couponController.handleApplyCoupon
  );
  //address
  router.get("/address/province", addressController.readProvinces);
  router.post("/address/district", addressController.readDistricts);
  router.post("/address/wards", addressController.readWards);
  router.post("/address/create", addressController.createAddress);
  router.post("/address/update", addressController.updateAddress);
  router.get(
    "/address/read-address",

    addressController.readAddress
  );
  router.delete(
    "/address/delete/:id",

    addressController.deleteAddress
  );
  //order
  router.post("/order/create", cartController.handleCreateOrder);
  router.get("/order/read", cartController.readOrder);
  router.post("/order/details", cartController.readOrderDetails);
  //wishlist
  router.get("/wishlist/read", wishlistController.readWishlist);
  router.post(
    "/wishlist/add-to-wishlist",

    wishlistController.handleAddProduct
  );
  router.post(
    "/wishlist/delete",

    wishlistController.handleDeleteProduct
  );

  //blog
  router.get("/blog/read", blogController.readBlog);
  //contact
  router.post("/contact/add", contactController.handleAddContact);

  return app.use("/api/", router);
};

export default initApiRoutes;
