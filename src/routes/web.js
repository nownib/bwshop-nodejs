import express from "express";

const router = express.Router();

/**
 *
 * @param {*} app - express app
 */
const initWebRoutes = (app) => {
  router.get("/", (req, res) => {
    return res.send("Hello world from bwshop snack");
  });

  return app.use("/", router);
};

export default initWebRoutes;
