import { where } from "sequelize/dist/index.js";
import db from "../models/index";

const addProductToCart = async (userId, productId, quantity) => {
  try {
    let cart = await db.Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      cart = await db.Cart.create({ userId: userId });
    }
    cart = cart.get({ plain: true });

    let cartItem = await db.Cart_Items.findOne({
      where: { cartId: cart.id, productId },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      // await cartItem.update({
      //   quantity: quantity,
      // });
    } else {
      await db.Cart_Items.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      });
    }
    return {
      EM: "Product successfully added to cart!",
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

const fetchItemsInCart = async (userId) => {
  try {
    let cart = await db.Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      cart = await db.Cart.create({ userId: userId });
    }
    cart = cart.get({ plain: true });
    let data = await db.Product.findAll({
      attributes: ["id", "name", "price", "imageUrl"],
      include: {
        model: db.Cart,
        attributes: ["orderId"],
        where: { id: cart.id },
      },
      raw: true, //js obj
      nest: true, ///lồng các kq vào obj con
    });
    return {
      EM: "Get items successfully",
      EC: 0,
      DT: data,
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

const deleteProductInCart = async (productId, userId) => {
  try {
    const cart = await db.Cart.findOne({
      where: { userId: userId },
    });

    await db.Cart_Items.destroy({
      where: { productId: productId, cartId: cart.id },
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
module.exports = { addProductToCart, fetchItemsInCart, deleteProductInCart };
