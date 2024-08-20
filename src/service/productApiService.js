import { where } from "sequelize/lib/sequelize";
import db from "../models/index";

const getAllProductsTrending = async () => {
  try {
    let data = await db.Product.findAll({
      where: { status: "Trending" },
      include: { model: db.Category, attributes: ["name"] },
      raw: true,
      nest: true,
    });
    return {
      EM: `Get all product trending succeeds`,
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Some thing wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const getAllCategories = async () => {
  try {
    let data = await db.Category.findAll({
      order: [["name", "ASC"]],
      raw: true,
    });
    return {
      EM: `Get all categories succeeds`,
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Some thing wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};
const getAllProducts = async () => {
  try {
    let data = await db.Product.findAll({
      include: { model: db.Category, attributes: ["name"] },
      order: [["id", "DESC"]],
      raw: true,
      nest: true,
    });
    return {
      EM: `Get all products succeeds`,
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Some thing wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = {
  getAllProductsTrending,
  getAllCategories,
  getAllProducts,
};
