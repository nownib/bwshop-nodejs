"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Coupon, {
        foreignKey: "coupon",
      });

      Order.belongsTo(models.User, {
        foreignKey: "userId",
      });

      Order.hasMany(models.Order_Items, {
        foreignKey: "orderId",
        as: "orderItems",
      });
    }
  }

  Order.init(
    {
      userId: DataTypes.UUID,
      totalPrice: DataTypes.DECIMAL(10, 2),
      address: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      paymentStatus: DataTypes.STRING,
      coupon: DataTypes.STRING,
      createTime: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: "Order",
      timestamps: false,
    }
  );

  return Order;
};
