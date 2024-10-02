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
const upSertReivew = async (dataReview, userId) => {
  try {
    let review = await db.Rating.findOne({
      where: { userId: userId, productId: dataReview.productId },
    });
    if (review) {
      await review.update({
        userId: userId,
        productId: dataReview.productId,
        review: dataReview.review,
        rating: dataReview.rating,
      });
    } else {
      await db.Rating.create({
        userId: userId,
        productId: dataReview.productId,
        review: dataReview.review,
        rating: dataReview.rating,
      });
    }
    let avgRating = await db.Rating.findOne({
      where: { productId: dataReview.productId },
      attributes: [
        [db.Sequelize.fn("AVG", db.Sequelize.col("rating")), "avgRating"],
      ],
      raw: true,
    });

    avgRating = avgRating.avgRating
      ? parseFloat(avgRating.avgRating).toFixed(2)
      : "0.00";

    // let ratingByProduct = await db.Rating.findAll({
    //   where: { productId: dataReview.productId },
    // });
    // const avgRating = await Promise.all(
    //   ratingByProduct.map(async (item) => {
    //     const rating = +item.rating;
    //     return rating;
    //   })
    // ).then((values) => {
    //   const total = values.reduce((acc, val) => acc + val, 0);
    //   const avg = total / ratingByProduct.length;
    //   return avg.toFixed(2);
    // });

    let product = await db.Product.findOne({
      where: { id: dataReview.productId },
      raw: false,
    });
    if (product) {
      await product.update({
        rating: avgRating,
      });
    }
    return {
      EM: `Thank you for your review!`,
      EC: 0,
      DT: "",
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

const getReviewsByProduct = async (productId) => {
  try {
    let data = await db.Rating.findAll({
      where: { productId: productId },
      include: { model: db.User, attributes: ["username", "avatar"] },
      order: [["id", "DESC"]],
      raw: true,
      nest: true,
    });
    return {
      EM: `Get reviews succeeds`,
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

const getProductDetails = async (productId) => {
  try {
    let data = await db.Product.findOne({
      where: { id: productId },
      include: { model: db.Category, attributes: ["name"] },
      raw: true,
      nest: true,
    });
    return {
      EM: `Get product succeeds`,
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

const getRatingsByStar = async (productId) => {
  try {
    let ratings = await db.Rating.findAll({
      where: { productId: productId },
      attributes: [
        "rating",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("rating")), "count"],
      ],
      group: ["rating"],
      raw: true,
      nest: true,
    });
    let totalCountRatings = ratings.reduce((sum, item) => sum + item.count, 0);

    let allRatings = [5, 4, 3, 2, 1];
    let data = allRatings.map((star) => {
      let found = ratings.find((item) => item.rating === star);

      return {
        star: star,
        count: found ? found.count : 0,
        average: found
          ? ((found.count / totalCountRatings) * 100).toFixed(2)
          : 0,
      };
    });
    return {
      EM: `Get rating succeeds`,
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
  upSertReivew,
  getReviewsByProduct,
  getProductDetails,
  getRatingsByStar,
};
