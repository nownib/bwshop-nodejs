import express from "express";
import userController from "../controller/userController";
import productController from "../controller/productController";
import cartController from "../controller/cartController";
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
        maxAge: 5 * 60 * 60 * 1000,
      });
      res.redirect(
        `${process.env.URL_REACT}/google/redirect?token=${user.token}&email=${user.email}&username=${user.username}`
      );
    }
  );
  //product
  router.get("/product/trend", productController.readProductTrending);
  router.get("/category/read", productController.readCategory);
  router.get("/product/read", productController.readProduct);
  //cart
  router.post(
    "/cart/add-product-to-cart",
    checkUserJWT,
    cartController.handleAddProduct
  );
  router.post("/cart/delete", checkUserJWT, cartController.handleDeleteProduct);
  router.get("/cart/read", checkUserJWT, cartController.readCart);
  return app.use("/api/", router);
};

export default initApiRoutes;
