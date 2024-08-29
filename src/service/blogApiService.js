import db from "../models/index";

const getAllBlogs = async () => {
  try {
    let data = await db.Blog.findAll({
      order: [["id", "ASC"]],
      raw: true,
      nest: true,
    });
    return {
      EM: `Get all blogs succeeds`,
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

module.exports = { getAllBlogs };
