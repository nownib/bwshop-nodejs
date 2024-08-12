import userApiService from "../service/userApiService";

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
        maxAge: 5 * 60 * 60 * 1000,
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
  return res.status(200).json({
    EM: "Authenticated successful",
    EC: 0,
    DT: {
      token: req.token,
      username: req.user.username,
      email: req.user.email,
    },
  }); //reload
};

const handleLogout = async (req, res) => {
  try {
    await res.clearCookie("jwt");
    await res.clearCookie("connect.sid");
    return res.status(200).json({
      EM: "Clear cookie done", //message
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

module.exports = {
  handleRegisterUser,
  handleLogin,
  getUserAccount,
  handleLogout,
};
