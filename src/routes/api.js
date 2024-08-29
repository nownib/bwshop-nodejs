import express from "express";
import userController from "../controller/userController";
import productController from "../controller/productController";
import cartController from "../controller/cartController";
import blogController from "../controller/blogController";
import wishlistController from "../controller/wishlistController";
import passport from "passport";
import { checkUserJWT } from "../middleware/JWTAction";

const router = express.Router();

const initApiRoutes = (app) => {
  //user
  router.post("/register", userController.handleRegisterUser);
  router.post("/login", userController.handleLogin);
  router.get("/account", checkUserJWT, userController.getUserAccount);
  router.get("/logout", userController.handleLogout);

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
  //order
  router.post("/order/create", checkUserJWT, cartController.handleCreateOrder);
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

  return app.use("/api/", router);
};

export default initApiRoutes;
