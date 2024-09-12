import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { createJWT } from "../middleware/JWTAction";
import { where } from "sequelize/lib/sequelize";
const { v4: uuidv4 } = require("uuid");

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = async (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};
const checkStrengthPassword = async (userPassword) => {
  let regEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*"'()+,-./:;<=>?[\]^_`{|}~])(?=.{8,})/;
  if (!regEx.test(userPassword)) {
    return true;
  }
  return false;
};

const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });
  if (user) {
    return true;
  }
  return false;
};

const checkPhoneExist = async (userPhone) => {
  let user = await db.User.findOne({
    where: { phone: userPhone },
  });
  if (user) {
    return true;
  }
  return false;
};
const registerUser = async (userData) => {
  try {
    let isPhoneExist = await checkPhoneExist(userData.phone);
    if (isPhoneExist === true) {
      return {
        EM: "The phone is already exist",
        EC: 1,
      };
    }
    let isEmailExist = await checkEmailExist(userData.email);
    if (isEmailExist === true) {
      return {
        EM: "The email is already exist",
        EC: 1,
      };
    }

    // let isStrengthPassword = await checkStrengthPassword(userData.password);
    // if (isStrengthPassword === true) {
    //   return {
    //     EM: "The password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.",
    //     EC: 1,
    //   };
    // }

    let hashPassword = await hashUserPassword(userData.password);

    await db.User.create({
      id: uuidv4(),
      username: userData.username,
      phone: userData.phone,
      email: userData.email,
      password: hashPassword,
    });
    return {
      EM: "Registration successful",
      EC: 0,
    };
  } catch (error) {
    return {
      EM: "Error from server",
      EC: -1,
    };
  }
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword); //true or false
};
const loginUser = async (loginData) => {
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [
          { phone: loginData.valueLogin },
          { email: loginData.valueLogin },
        ],
      },
    });
    if (user && user.password !== null) {
      let isCheckPassword = checkPassword(loginData.password, user.password);
      if (isCheckPassword === true) {
        let payload = {
          email: user.email,
          username: user.username,
          phone: user.phone,
          avatar: user.avatar,
          id: user.id,
        };
        let token = createJWT(payload);
        return {
          EM: "Login successful!",
          EC: 0,
          DT: {
            token: token,
            email: user.email,
            username: user.username,
            phone: user.phone,
            avatar: user.avatar,
          },
        };
      }
    }
    return {
      EM: "Email/phone or password incorrect!",
      EC: 1,
      DT: "",
    };
  } catch (error) {}
};
const upsertUserSocialMedia = async (typeAccount, dataRaw) => {
  try {
    let user = null;
    if (typeAccount === "GOOGLE") {
      user = await db.User.findOne({
        where: {
          email: dataRaw.email,
          type: typeAccount,
        },
        raw: true,
      });
      if (!user) {
        user = await db.User.create({
          email: dataRaw.email,
          username: dataRaw.username,
          type: typeAccount,
        });
        user = user.get({ plain: true });
      }
      let payload = {
        email: user.email,
        username: user.username,
        id: user.id,
      };
      let token = createJWT(payload);

      return {
        token: token,
        email: user.email,
        username: user.username,
      };
    }
    return {
      token: "",
      email: "",
      username: "",
    };
  } catch (error) {
    console.log(error);
  }
};

const updateUserAccount = async (data, userId) => {
  try {
    let user = await db.User.findOne({
      where: { id: userId },
      raw: false,
      nest: false,
    });
    if (user) {
      await user.update({
        username: data.userData.username,
        phone: data.userData.phone,
        avatar: data.userData.avatar,
      });
      let payload = {
        email: user.email,
        username: user.username,
        phone: user.phone,
        avatar: user.avatar,
        id: user.id,
      };
      let token = createJWT(payload);
      return {
        EM: "Update information successfully",
        EC: 0,
        DT: {
          token: token,
          email: user.email,
          username: user.username,
          phone: user.phone,
        },
      };
    } else {
      return {
        EM: "User not found",
        EC: 2,
        DT: "",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Some thing wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

module.exports = {
  registerUser,
  checkPhoneExist,
  checkEmailExist,
  hashUserPassword,
  checkStrengthPassword,
  loginUser,
  checkPassword,
  upsertUserSocialMedia,
  updateUserAccount,
};
