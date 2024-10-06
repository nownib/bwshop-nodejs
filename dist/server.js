"use strict";

var _express = _interopRequireDefault(require("express"));
var _passport = _interopRequireDefault(require("passport"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _connectDB = _interopRequireDefault(require("./config/connectDB"));
var _googleController = _interopRequireDefault(require("./controller/social/googleController"));
var _web = _interopRequireDefault(require("./routes/web"));
var _api = _interopRequireDefault(require("./routes/api"));
var _viewEngine = _interopRequireDefault(require("./config/viewEngine"));
var _cors = _interopRequireDefault(require("./config/cors"));
var _cloudinary = require("cloudinary");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
require("dotenv").config();
var app = (0, _express["default"])();
(0, _connectDB["default"])();
(0, _cors["default"])(app);

// Config view engine
(0, _viewEngine["default"])(app);
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use((0, _cookieParser["default"])());

// Config session
app.use((0, _expressSession["default"])({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
}));

// Initialize passport
app.use(_passport["default"].initialize());
app.use(_passport["default"].session());
(0, _web["default"])(app);
(0, _api["default"])(app);
app.use(function (req, res) {
  return res.send("404 not found");
});
_cloudinary.v2.config({
  secure: true
});
(0, _googleController["default"])();
var port = process.env.PORT || 8088;
app.listen(port, function () {
  console.log("NodeJSServer is running at the port : " + port);
});