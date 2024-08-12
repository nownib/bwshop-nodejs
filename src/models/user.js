"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Cart, { foreignKey: "userId" });
      User.hasMany(models.Order, { foreignKey: "userId" });
      User.belongsToMany(models.Product, {
        through: "Wishlist",
        foreignKey: "userId",
      });
      User.belongsToMany(models.Product, {
        through: "Rating",
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      type: {
        type: DataTypes.STRING,
        defaultValue: "LOCAL",
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "CUSTOMER",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
