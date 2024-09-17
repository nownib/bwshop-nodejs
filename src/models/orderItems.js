"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order_Items extends Model {
    static associate(models) {
      Order_Items.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
      Order_Items.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }

  Order_Items.init(
    {
      orderId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order_Items",
    }
  );

  return Order_Items;
};
