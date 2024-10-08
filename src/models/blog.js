"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blog.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT("long"),
      imageUrl: DataTypes.STRING,
      author: {
        type: DataTypes.STRING,
        defaultValue: "Admin",
      },
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Blog",
      timestamps: false,
    }
  );
  return Blog;
};
