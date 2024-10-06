import db from "../models/index";
const { Op } = require("sequelize");

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
    let cart = await db.Cart.findOne({ where: { userId: userId }, raw: false });
    if (!cart) {
      cart = await db.Cart.create({ userId: userId });
    }
    let data = await db.Product.findAll({
      attributes: ["id", "sku", "name", "price", "imageUrl", "stock", "rating"],
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
    if (!dataOrder.address) {
      return {
        EM: "Please enter address",
        EC: 1,
        DT: [],
      };
    }
    const productIds = dataOrder.products.map((item) => item.id);
    const products = await db.Product.findAll({
      where: {
        id: {
          [Op.in]: productIds,
        },
      },
      raw: false,
    });
    let coupon;
    if (dataOrder.coupon) {
      coupon = await db.Coupon.findOne({
        where: { code: dataOrder.coupon },
      });
    }
    let isCheckStock = true;
    const totalAmount = dataOrder.products.reduce((total, item) => {
      const product = products.find((prod) => prod.id === item.id);
      const price = product.price;
      const quantity = item.quantity;
      if (product.stock >= quantity) {
        product.update({
          stock: product.stock - quantity,
        });
      } else {
        isCheckStock = false;
      }
      return total + (price * 100 * quantity) / 100;
    }, 0.0);

    if (isCheckStock === false) {
      return {
        EM: "The quantity exceeds the available stock!",
        EC: 1,
        DT: [],
      };
    }
    const totalOrder = coupon
      ? totalAmount - (totalAmount * coupon.value) / 100
      : totalAmount;
    if (+totalOrder.toFixed(4) === +dataOrder.totalPrice.toFixed(4)) {
      const order = await db.Order.create({
        userId: userId,
        totalPrice: +totalOrder.toFixed(2),
        address: dataOrder.address,
        paymentMethod: dataOrder.paymentMethod,
        paymentStatus: dataOrder.paymentStatus,
        coupon: coupon ? coupon.code : "",
      });
      if (order) {
        const orderItems = dataOrder.products.map((item) => ({
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
        }));
        await db.Order_Items.bulkCreate(orderItems);
      }
      return {
        EM: "Your order created successfully!",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Some thing wrongs with services",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Some thing wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const fetchOrderById = async (userId) => {
  try {
    let data = await db.Order.findAll({
      where: { userId: userId },
      attributes: [
        "id",
        "createTime",
        "totalPrice",
        "address",
        "paymentMethod",
      ],
      order: [["id", "DESC"]],
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
const fetchOrderDetails = async (orderId) => {
  try {
    const order = await db.Order.findOne({
      where: { id: orderId },
      attributes: ["id", "totalPrice", "address", "paymentMethod", "coupon"],
      raw: false,
      include: [
        {
          model: db.Order_Items,
          as: "orderItems",
          include: [
            {
              model: db.Product,
              as: "product",
              attributes: ["id", "sku", "name", "price", "imageUrl", "stock"],
            },
          ],
          attributes: ["quantity"],
        },
      ],
    });

    return {
      EM: "Get order details successfully",
      EC: 0,
      DT: order,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Some thing wrongs with order services ",
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
  fetchOrderById,
  fetchOrderDetails,
};
