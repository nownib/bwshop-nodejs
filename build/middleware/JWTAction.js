"use strict";

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
require("dotenv").config();
var nonSecurePaths = ["/", "/register", "/login", "/logout", "/send-email", "/reset-password", "/auth/google", "/google/redirect", "/product/read", "/category/read", "/product/trend", "/product/read-details/:productId", "/product/read-review/:productId", "/product/read-rating-by-star/:productId", "/address/province", "/address/district", "/address/wards", "/blog/read", "/contact/add"];
var createJWT = function createJWT(payload) {
  var key = process.env.JWT_SECRET;
  var token = null;
  try {
    token = _jsonwebtoken["default"].sign(payload, key, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
  } catch (error) {
    console.log("Error jwt", error);
  }
};
var verifyToken = function verifyToken(token) {
  var key = process.env.JWT_SECRET;
  var decoded = null;
  try {
    decoded = _jsonwebtoken["default"].verify(token, key);
  } catch (error) {
    // console.log("Error from verify token");
  }
  return decoded;
};
var extractToken = function extractToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};
var isNonSecurePath = function isNonSecurePath(path) {
  return nonSecurePaths.some(function (nonSecurePath) {
    var regex = new RegExp("^".concat(nonSecurePath.replace(/:[^\s/]+/, "[^/]+"), "$"));
    return regex.test(path);
  });
};
var checkUserJWT = function checkUserJWT(req, res, next) {
  if (isNonSecurePath(req.path)) {
    return next();
  }
  var cookies = req.cookies;
  var tokenFromHeader = extractToken(req);
  if (cookies && cookies.jwt || tokenFromHeader) {
    var token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
    var decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "Not authenticated the user"
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticated the user"
    });
  }
};
module.exports = {
  createJWT: createJWT,
  verifyToken: verifyToken,
  checkUserJWT: checkUserJWT,
  extractToken: extractToken
};