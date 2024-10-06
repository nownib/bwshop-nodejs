"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    static associate(models) {
      // Define associations
      District.belongsTo(models.Province, {
        foreignKey: "provinceId",
      });
      District.hasMany(models.Wards, {
        foreignKey: "districtId",
      });
      District.hasMany(models.Address, {
        foreignKey: "districtId",
      });
    }
  }

  District.init(
    {
      provinceId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "District",
      timestamps: false,
    }
  );

  return District;
};
