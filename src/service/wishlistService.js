import db from "../models/index";
import { Op } from "sequelize";

const addProductToWishlist = async (userId, id) => {
  try {
    let wishlist = await db.Wishlist.findOne({
      where: { userId: userId, productId: id },
    });
    if (!wishlist) {
      await db.Wishlist.create({
        userId: userId,
        productId: id,
      });
    }
    return {
      EM: "Product successfully added to wishlist!",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Some thing wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const fetchItemsInWishlist = async (userId) => {
  try {
    let wishlist = await db.Wishlist.findAll({ where: { userId: userId } });
    let wishlistId = wishlist.map((item) => item.id);

    let product = await db.Product.findAll({
      include: {
        model: db.Wishlist,
        attributes: [],
        where: { id: { [Op.in]: wishlistId } },
      },
      raw: true, //js obj
    });
    return {
      EM: "Get items successfully",
      EC: 0,
      DT: product,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Some thing wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const deleteProductInWishlist = async (userId, productId) => {
  try {
    await db.Wishlist.destroy({
      where: { productId: productId, userId: userId },
    });
    return {
      EM: "Delete product successfully!",
      EC: 0,
      DT: [],
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "Error from service",
      EC: 1,
      DT: [],
    };
  }
};
module.exports = {
  addProductToWishlist,
  fetchItemsInWishlist,
  deleteProductInWishlist,
};
