"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wards extends Model {
    static associate(models) {
      // Define associations
      Wards.belongsTo(models.District, {
        foreignKey: "districtId",
      });
    }
  }

  Wards.init(
    {
      districtId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Wards",
    }
  );

  return Wards;
};
