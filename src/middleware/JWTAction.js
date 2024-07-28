require("dotenv").config();
import jwt from "jsonwebtoken";

const nonSecurePaths = [
  "/register",
  "/login",
  "/logout",
  "/auth/google",
  "/google/redirect",
];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};

const extractToken = (req) => {
  //check token header
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};
const checkUserJWT = (req, res, next) => {
  //Kiểm tra cookie xem có còn hợp lệ không
  //check login
  if (nonSecurePaths.includes(req.path)) return next();

  let cookies = req.cookies; //khi guoi dung dang nhap thi req dc gui xuong day, can giai ma decoded, check permission va gui den controller
  const tokenFromHeader = extractToken(req);

  if ((cookies && cookies.jwt) || tokenFromHeader) {
    let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;

    let decoded = verifyToken(token); //data và token của controller, được giải mã và sử dụng
    if (decoded) {
      //ko co cookie -> ko co du lieu truyen xuong server -> logout
      req.user = decoded; // *** cos theer dinh kem them data gui den server controller
      req.token = token; //khi đăng nhập nó sẽ gửi 2 cái này đến controller, từ đó controller sử dụng token và user để check những lần refresh sau
      next();
    } else {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "Not authenticated the user",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticated the user",
    });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  extractToken,
};
