import express from "express";
import userController from "../controller/userController";
import passport from "passport";
import { checkUserJWT } from "../middleware/JWTAction";

const router = express.Router();

const initApiRoutes = (app) => {
  router.all("*", checkUserJWT);
  router.post("/register", userController.handleRegisterUser);
  router.post("/login", userController.handleLogin);
  router.get("/account", userController.getUserAccount);
  router.get("/logout", userController.handleLogout);

  // Social authentication
  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/google/redirect",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000/login",
    }),
    (req, res) => {
      const user = req.user;
      res.cookie("jwt", user.token, {
        httpOnly: true,
        maxAge: 5 * 60 * 60 * 1000,
      });
      res.redirect(
        `http://localhost:3000/google/redirect?token=${user.token}&email=${user.email}&username=${user.username}`
      );
    }
  );

  return app.use("/api/", router);
};

export default initApiRoutes;
