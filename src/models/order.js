"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        /* options */
        foreignKey: "userId",
      });
      Order.belongsToMany(models.Product, {
        through: "Order_Items",
        foreignKey: "orderId",
      });
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      totalPrice: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
