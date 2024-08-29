import db from "../models/index";

const addProductToCart = async (userId, productId, quantity) => {
  try {
    let cart = await db.Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      cart = await db.Cart.create({ userId: userId });
    }

    let cartItem = await db.Cart_Items.findOne({
      where: { cartId: cart.id, productId },
      raw: false,
    });
    let product = await db.Product.findOne({
      where: { id: productId },
      raw: false,
    });
    if (cartItem) {
      cartItem.quantity = cartItem.quantity + quantity;
      if (cartItem.quantity <= product.stock) {
        await cartItem.update({
          quantity: cartItem.quantity,
        });
      } else {
        return {
          EM: "Exceeded inventory quantity!",
          EC: 1,
          DT: [],
        };
      }
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
      attributes: ["id", "sku", "name", "price", "imageUrl", "stock"],
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
    let cart = await db.Cart.findOne({
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

const updateProductInCart = async (userId, productId, quantity) => {
  try {
    let cart = await db.Cart.findOne({ where: { userId: userId } });
    cart = cart.get({ plain: true });

    let cartItem = await db.Cart_Items.findOne({
      where: { cartId: cart.id, productId: productId },
      raw: false,
    });
    if (cartItem) {
      await cartItem.update({
        quantity: quantity,
      });
    } else {
      return {
        EM: "Product not found",
        EC: 1,
        DT: "",
      };
    }
    return {
      EM: "Product successfully updated in cart!",
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

const clearCart = async (userId) => {
  try {
    let cart = await db.Cart.findOne({
      where: { userId: userId },
    });

    await db.Cart_Items.destroy({
      where: { cartId: cart.id },
    });
    return {
      EM: "Clear cart successfully!",
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

const createOrder = async (dataOrder, userId) => {
  try {
    await db.Order.create({
      userId: userId,
      totalPrice: dataOrder.totalPrice,
      address: dataOrder.address,
      paymentMethod: dataOrder.paymentMethod,
      paymentStatus: dataOrder.paymentStatus,
    });
    return {
      EM: "Your order created successfully!",
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
module.exports = {
  addProductToCart,
  fetchItemsInCart,
  deleteProductInCart,
  updateProductInCart,
  clearCart,
  createOrder,
};
