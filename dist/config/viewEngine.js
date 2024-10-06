"use strict";

var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Config view engine (ejs) for the express app
 */

var configViewEngine = function configViewEngine(app) {
  app.set("view engine", "ejs");
  app.set("views", "./src/views");
  app.use(_express["default"]["static"]("./src/public"));
};
module.exports = configViewEngine;