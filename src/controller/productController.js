import productApiService from "../service/productApiService";

const readProductTrending = async (req, res) => {
  try {
    let data = await productApiService.getAllProductsTrending();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const readCategory = async (req, res) => {
  try {
    let data = await productApiService.getAllCategories();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const readProduct = async (req, res) => {
  try {
    let data = await productApiService.getAllProducts();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const handleUpSertReview = async (req, res) => {
  try {
    let dataReview = req.body.data;
    let userId = req.user.id;
    let data = await productApiService.upSertReivew(dataReview, userId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
};
module.exports = {
  readProductTrending,
  readCategory,
  readProduct,
  handleUpSertReview,
};
