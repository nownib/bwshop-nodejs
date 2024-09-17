import express from "express";
import userController from "../controller/userController";
import productController from "../controller/productController";
import cartController from "../controller/cartController";
import blogController from "../controller/blogController";
import wishlistController from "../controller/wishlistController";
import contactController from "../controller/contactController";
import addressController from "../controller/addressController";
import passport from "passport";
import { checkUserJWT } from "../middleware/JWTAction";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const initApiRoutes = (app) => {
  //user
  router.post("/register", userController.handleRegisterUser);
  router.post("/login", userController.handleLogin);
  router.get("/account", checkUserJWT, userController.getUserAccount);
  router.get("/logout", userController.handleLogout);
  router.put("/account/update", checkUserJWT, userController.updateAccount);
  router.post(
    "/account/upload-image",
    checkUserJWT,
    upload.single("file"),
    userController.uploadImage
  );
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
        `${process.env.URL_REACT}/google/redirect?token=${user.token}&email=${user.email}&username=${user.username}&id=${user.id}`
      );
    }
  );
  //product
  router.get("/product/trend", productController.readProductTrending);
  router.get("/category/read", productController.readCategory);
  router.get("/product/read", productController.readProduct);
  //cart
  router.get("/cart/read", checkUserJWT, cartController.readCart);
  router.post(
    "/cart/add-product-to-cart",
    checkUserJWT,
    cartController.handleAddProduct
  );
  router.post(
    "/cart/update-cart",
    checkUserJWT,
    cartController.handleUpdateProduct
  );
  router.post("/cart/delete", checkUserJWT, cartController.handleDeleteProduct);
  router.post("/cart/clear", checkUserJWT, cartController.handleClearCart);

  //address
  router.get("/address/province", addressController.readProvinces);
  router.post("/address/district", addressController.readDistricts);
  router.post("/address/wards", addressController.readWards);
  router.post("/address/create", checkUserJWT, addressController.createAddress);

  router.post(
    "/address/read-address",
    checkUserJWT,
    addressController.readAddress
  );
  //order
  router.post("/order/create", checkUserJWT, cartController.handleCreateOrder);
  router.get("/order/read", checkUserJWT, cartController.readOrder);
  router.post("/order/details", checkUserJWT, cartController.readOrderDetails);
  //wishlist
  router.get("/wishlist/read", checkUserJWT, wishlistController.readWishlist);
  router.post(
    "/wishlist/add-to-wishlist",
    checkUserJWT,
    wishlistController.handleAddProduct
  );
  router.post(
    "/wishlist/delete",
    checkUserJWT,
    wishlistController.handleDeleteProduct
  );

  //blog
  router.get("/blog/read", blogController.readBlog);
  //contact
  router.post("/contact/add", contactController.handleAddContact);

  return app.use("/api/", router);
};

export default initApiRoutes;
