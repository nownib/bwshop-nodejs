"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Coupon.hasMany(models.Order, {
        foreignKey: "coupon",
      });
    }
  }
  Coupon.init(
    {
      code: {
        type: DataTypes.STRING,
        unique: true,
      },
      value: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Coupon",
      timestamps: false,
    }
  );
  return Coupon;
};
