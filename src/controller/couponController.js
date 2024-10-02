import couponApiService from "../service/couponApiService";

const handleApplyCoupon = async (req, res) => {
  try {
    let code = req.body.code;
    let data = await couponApiService.applyCoupon(code);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  handleApplyCoupon,
};
