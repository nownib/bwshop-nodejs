import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { createJWT } from "../middleware/JWTAction";
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
const checkEmailValid = async (email) => {
  let emailRegx = /\S+@\S+\.\S+/;
  if (!emailRegx.test(email)) {
    return false;
  }
  return true;
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
const checkPhoneValid = async (phone) => {
  let phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return false;
  }
  return true;
};
const registerUser = async (userData) => {
  try {
    if (userData.username.length > 25 || userData.username.length < 2) {
      return {
        EM: "Name is too long or too short",
        EC: 1,
      };
    }
    let isPhoneExist = await checkPhoneExist(userData.phone);
    if (isPhoneExist === true) {
      return {
        EM: "The phone is already exist",
        EC: 2,
      };
    }
    let isPhoneValid = await checkPhoneValid(userData.phone);
    if (isPhoneValid === false) {
      return {
        EM: "The phone is invalid",
        EC: 1,
      };
    }
    let isEmailExist = await checkEmailExist(userData.email);
    if (isEmailExist === true) {
      return {
        EM: "The email is already exist",
        EC: 3,
      };
    }
    let isEmailValid = await checkEmailValid(userData.email);
    if (isEmailValid === false) {
      return {
        EM: "The email is invalid",
        EC: 1,
      };
    }
    let isStrengthPassword = await checkStrengthPassword(userData.password);
    if (isStrengthPassword === true) {
      return {
        EM: "The password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character.",
        EC: 1,
      };
    }
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
        type: "LOCAL",
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
          id: uuidv4(),
          email: dataRaw.email,
          username: dataRaw.username,
          type: typeAccount,
          avatar: dataRaw.avatar,
        });
        user = user.get({ plain: true });
      }
      let payload = {
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        id: user.id,
      };
      let token = createJWT(payload);

      return {
        token: token,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
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
    if (
      data.userData.username.length > 25 ||
      data.userData.username.length < 2
    ) {
      return {
        EM: "Name is too long or short",
        EC: 1,
      };
    }
    if (user) {
      if (data.userData.phone !== user.phone) {
        let isPhoneExist = await checkPhoneExist(data.userData.phone);
        if (isPhoneExist === true) {
          return {
            EM: "The phone is already exist",
            EC: 2,
          };
        }
        if (data.userData.phone !== user.phone) {
          let isPhoneValid = await checkPhoneValid(data.userData.phone);
          if (isPhoneValid === false) {
            return {
              EM: "The phone is invalid",
              EC: 1,
            };
          }
        }
      }

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
const updateUserCode = async (OTP, email) => {
  try {
    const expirationTime = new Date(Date.now() + 2 * 60 * 1000);
    await db.User.update(
      { code: OTP, codeExpirationTime: expirationTime },
      {
        where: { email: email, type: "LOCAL" },
      }
    );
  } catch (error) {
    console.log(error);
    return {
      EM: "Some thing wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const isEmailLocal = async (email) => {
  try {
    let user = await db.User.findOne({
      where: { email: email, type: "LOCAL" },
    });
    if (user) {
      return true;
    } else return false;
  } catch (error) {
    return false;
  }
};
const resetUserPassword = async (rawData) => {
  try {
    let isStrengthPassword = await checkStrengthPassword(rawData.newPassword);
    if (isStrengthPassword === true) {
      return {
        EM: "The password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character.",
        EC: 1,
        DT: "",
      };
    }
    let user = await db.User.findOne({
      where: {
        email: rawData.email,
        type: "LOCAL",
        code: rawData.code,
      },
      raw: false,
    });
    if (user) {
      let isCheckPassword = checkPassword(rawData.newPassword, user.password);
      if (isCheckPassword) {
        return {
          EM: "The new password is the same as the old password.",
          EC: 2,
          DT: "",
        };
      } else if (new Date() > user.codeExpirationTime) {
        return {
          EM: "OTP has expired",
          EC: 3,
          DT: "",
        };
      } else {
        let newPassword = await hashUserPassword(rawData.newPassword);
        await user.update({
          password: newPassword,
        });
        return {
          EM: "Reset password successful!",
          EC: 0,
          DT: "",
        };
      }
    }

    return {
      EM: "The email or code is incorrect!",
      EC: 1,
      DT: "",
    };
  } catch (error) {
    console.log(error);
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
  updateUserCode,
  isEmailLocal,
  resetUserPassword,
};
