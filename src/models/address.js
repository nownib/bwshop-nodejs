"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Address.init(
    {
      userId: DataTypes.UUID,
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      wards: DataTypes.STRING,
      specificAddress: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
