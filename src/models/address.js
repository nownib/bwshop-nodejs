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
      Address.belongsTo(models.Province, { foreignKey: "provinceId" });
      Address.belongsTo(models.District, { foreignKey: "districtId" });
      Address.belongsTo(models.Wards, { foreignKey: "wardsId" });
    }
  }
  Address.init(
    {
      userId: DataTypes.UUID,
      provinceId: DataTypes.INTEGER,
      districtId: DataTypes.INTEGER,
      wardsId: DataTypes.INTEGER,
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      wards: DataTypes.STRING,
      specificAddress: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address",
      timestamps: false,
    }
  );
  return Address;
};
