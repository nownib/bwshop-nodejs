"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    static associate(models) {
      // Define associations
      Province.hasMany(models.District, {
        foreignKey: "provinceId",
      });
    }
  }

  Province.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Province",
    }
  );

  return Province;
};
