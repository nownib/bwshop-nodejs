import db from "../models/index";

const applyCoupon = async (code) => {
  try {
    let coupon = await db.Coupon.findOne({
      where: { code: code },
      raw: true,
      nest: true,
    });
    let currentTime = new Date();
    if (coupon && coupon.start_date <= currentTime) {
      if (coupon.end_date >= currentTime) {
        return {
          EM: "Apply coupon successfully",
          EC: 0,
          DT: coupon,
        };
      } else {
        return {
          EM: "Coupon has expried",
          EC: 3,
          DT: "",
        };
      }
    } else {
      return {
        EM: "Coupon does not exist!",
        EC: 2,
        DT: "",
      };
    }
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
  applyCoupon,
};
