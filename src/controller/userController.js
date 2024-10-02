import userApiService from "../service/userApiService";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";
import "dotenv/config";

const handleRegisterUser = async (req, res) => {
  try {
    let data = await userApiService.registerUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: "",
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server",
      EC: -1,
      DT: "",
    });
  }
};
const handleLogin = async (req, res) => {
  try {
    let data = await userApiService.loginUser(req.body);
    if (data && data.DT && data.DT.token) {
      //set cookie
      res.cookie("jwt", data.DT.token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server",
      EC: -1,
      DT: "",
    });
  }
};

const getUserAccount = (req, res) => {
  try {
    if (req.token) {
      return res.status(200).json({
        EM: "Authenticated successful",
        EC: 0,
        DT: {
          token: req.token,
          username: req.user.username,
          email: req.user.email,
          phone: req.user.phone,
          avatar: req.user.avatar,
        },
      }); //reload
    }
  } catch (error) {}
};

const handleLogout = async (req, res) => {
  try {
    await res.clearCookie("jwt");
    return res.status(200).json({
      EM: "Clear cookie done",
      EC: 0, //code
      DT: "", //data
    });
  } catch (error) {
    console.log("Check err", error);
    return res.status(500).json({
      EM: "Error from server", //message
      EC: -1, //code
      DT: "", //data
    });
  }
};

const updateAccount = async (req, res) => {
  try {
    let userId = req.user.id;
    let data = await userApiService.updateUserAccount(req.body, userId);
    if (data && data.DT && data.DT.token) {
      //set cookie
      res.cookie("jwt", data.DT.token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server",
      EC: -1,
      DT: "",
    });
  }
};

const uploadImage = async (req, res) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {
    const result = await cloudinary.uploader.upload(req.file.path, options);
    return res.status(200).json({
      EM: "Upload image to Cloudinary successfully",
      EC: 0,
      DT: result.secure_url,
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({
      EM: "Error from server",
      EC: -1,
      DT: "",
    });
  }
};
const sendEmail = async (req, res) => {
  const email = req.body.email;
  let checkEmailLocal = await userApiService.isEmailLocal(email);
  if (!checkEmailLocal) {
    return res.status(401).json({
      EM: `Not found the email: ${email} in the system!`,
      EC: -1,
      DT: "",
    });
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GOOGLE_APP_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });
  const OTP = Math.floor(100000 + Math.random() * 900000);
  try {
    const info = await transporter.sendMail({
      from: `BW SHOP 👻 <${process.env.GOOGLE_APP_EMAIL}>`,
      to: `${email}`,
      subject: "Request reset password",
      text: "",
      html: `<b>Hello!</b>
            <div>To reset your password, please use the OTP below:</div>
            <div style="font-size: 24px; font-weight: bold; margin: 10px 0;">Your OTP: ${OTP}</div>
            <div>If you did not request a password reset, please ignore this email.</div>
            <div>Best regards,</div>
            <div>Your Support Team</div>`,
    });
    await userApiService.updateUserCode(OTP, email);
    return res.status(200).json({
      EM: "Send email successful!",
      EC: 0,
      DT: "",
    });
  } catch (error) {
    console.log("Send email failed", error);
    return res.status(500).json({
      EM: "Send email failed",
      EC: -1,
      DT: "",
    });
  }
};

const handleResetPassword = async (req, res) => {
  try {
    const rawData = req.body.data;
    let data = await userApiService.resetUserPassword(rawData);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: "",
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server",
      EC: -1,
      DT: "",
    });
  }
};
module.exports = {
  handleRegisterUser,
  handleLogin,
  getUserAccount,
  handleLogout,
  updateAccount,
  uploadImage,
  sendEmail,
  handleResetPassword,
};
