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
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
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
};
