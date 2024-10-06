"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}

var router = _express["default"].Router();

/**
 *
 * @param {*} app - express app
 */
var initWebRoutes = function initWebRoutes(app) {
  router.get("/", function (req, res) {
    return res.send("Hello world from wbshop-snack");
  });

  return app.use("/", router);
};
var _default = (exports["default"] = initWebRoutes);
