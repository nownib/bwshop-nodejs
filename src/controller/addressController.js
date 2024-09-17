import addressApiService from "../service/addressApiService";

const readProvinces = async (req, res) => {
  try {
    let data = await addressApiService.fetchAllProvinces();
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
const readDistricts = async (req, res) => {
  try {
    let data = await addressApiService.fetchDistrictsByProvince(req.body.id);
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
const readWards = async (req, res) => {
  try {
    let data = await addressApiService.fetchWardsByDistrict(req.body.id);
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

const createAddress = async (req, res) => {
  try {
    let userId = req.user.id;
    let rawDataAddress = req.body;
    let data = await addressApiService.createNewAddress(userId, rawDataAddress);
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
const readAddress = async (req, res) => {
  try {
    let userId = req.user.id;
    let data = await addressApiService.fetchAddressByUser(userId);
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
module.exports = {
  readProvinces,
  readDistricts,
  readWards,
  createAddress,
  readAddress,
};
