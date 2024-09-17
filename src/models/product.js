"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Define associations
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });
      Product.belongsToMany(models.Cart, {
        through: "Cart_Items",
        foreignKey: "productId",
        otherKey: "cartId",
      });

      Product.belongsToMany(models.Order, {
        through: "Order_Items",
        foreignKey: "productId",
        otherKey: "orderId",
      });

      Product.hasMany(models.Wishlist, {
        foreignKey: "productId",
      });

      Product.belongsToMany(models.User, {
        through: "Rating",
        foreignKey: "productId",
      });
    }
  }

  Product.init(
    {
      sku: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.TEXT("long"),
      price: DataTypes.DECIMAL(10, 2),
      imageUrl: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
