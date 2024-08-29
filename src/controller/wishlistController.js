import wishlistService from "../service/wishlistService";

const handleAddProduct = async (req, res) => {
  try {
    let id = req.body.id;
    let userId = req.user.id;
    let data = await wishlistService.addProductToWishlist(userId, id);
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

const readWishlist = async (req, res) => {
  try {
    let userId = req.user.id;
    let data = await wishlistService.fetchItemsInWishlist(userId);
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

const handleDeleteProduct = async (req, res) => {
  try {
    let productId = req.body.id;
    let userId = req.user.id;
    let data = await wishlistService.deleteProductInWishlist(userId, productId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from controller",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  handleAddProduct,
  readWishlist,
  handleDeleteProduct,
};
