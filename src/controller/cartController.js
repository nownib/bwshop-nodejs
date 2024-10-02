import cartApiService from "../service/cartApiService";

const handleAddProduct = async (req, res) => {
  try {
    let productId = req.body.productId;
    let quantity = req.body.quantity;
    let userId = req.user.id;
    let data = await cartApiService.addProductToCart(
      userId,
      productId,
      quantity
    );
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

const readCart = async (req, res) => {
  try {
    let userId = req.user.id;
    let data = await cartApiService.fetchItemsInCart(userId);
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
    let data = await cartApiService.deleteProductInCart(productId, userId);
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

const handleUpdateProduct = async (req, res) => {
  try {
    let productId = req.body.productId;
    let quantity = req.body.quantity;
    let userId = req.user.id;
    // console.log(productId);
    // console.log("check", userId);
    // console.log(quantity);
    let data = await cartApiService.updateProductInCart(
      userId,
      productId,
      quantity
    );
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

const handleClearCart = async (req, res) => {
  try {
    let userId = req.user.id;
    let data = await cartApiService.clearCart(userId);
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
const handleCreateOrder = async (req, res) => {
  try {
    let userId = req.user.id;
    let payload = req.body.data;
    let data = await cartApiService.createOrder(payload, userId);
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
const readOrder = async (req, res) => {
  try {
    let userId = req.user.id;
    let data = await cartApiService.fetchOrderById(userId);
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

const readOrderDetails = async (req, res) => {
  try {
    let orderId = req.body.orderId;
    let data = await cartApiService.fetchOrderDetails(orderId);
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
  handleAddProduct,
  readCart,
  handleDeleteProduct,
  handleUpdateProduct,
  handleClearCart,
  handleCreateOrder,
  readOrder,
  readOrderDetails,
};
