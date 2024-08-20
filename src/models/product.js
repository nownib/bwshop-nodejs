"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {
        /* options */
        foreignKey: "categoryId",
      });
      Product.belongsToMany(models.Cart, {
        through: "Cart_Items",
        foreignKey: "productId",
        otherKey: "cartId",
      });
      Product.belongsToMany(models.User, {
        through: "Wishlists",
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
