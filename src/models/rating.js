"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rating.belongsTo(models.User, { foreignKey: "userId" });
      Rating.belongsTo(models.Product, { foreignKey: "productId" });
    }
  }
  Rating.init(
    {
      productId: DataTypes.INTEGER,
      userId: DataTypes.UUID,
      rating: DataTypes.INTEGER,
      review: DataTypes.STRING,
      createTime: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: "Rating",
      timestamps: false,
    }
  );
  return Rating;
};
