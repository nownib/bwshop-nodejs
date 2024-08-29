import blogApiService from "../service/blogApiService";

const readBlog = async (req, res) => {
  try {
    let data = await blogApiService.getAllBlogs();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
};

module.exports = {
  readBlog,
};
