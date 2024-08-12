"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, {
        /* options */
        foreignKey: "userId",
      });

      Cart.belongsTo(models.Order, {
        /* options */
        foreignKey: "orderId",
      });

      Cart.belongsToMany(models.Product, {
        through: "Cart_Items",
        foreignKey: "cartId",
        otherKey: "productId",
      });
    }
  }
  Cart.init(
    {
      userId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
