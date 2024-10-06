import db from "../models/index";

const fetchAllProvinces = async () => {
  try {
    let data = await db.Province.findAll({
      raw: true,
      nest: true,
    });
    return {
      EM: "Get province successfully",
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
const fetchDistrictsByProvince = async (provinceId) => {
  try {
    let data = await db.District.findAll({
      where: { provinceId: provinceId },
      raw: true,
      nest: true,
    });
    return {
      EM: "Get district successfully",
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
const fetchWardsByDistrict = async (districtId) => {
  try {
    let data = await db.Wards.findAll({
      where: { districtId: districtId },
      raw: true,
      nest: true,
    });
    return {
      EM: "Get wards successfully",
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
const createNewAddress = async (userId, rawDataAddress) => {
  try {
    if (
      rawDataAddress &&
      rawDataAddress.provinceId &&
      rawDataAddress.district &&
      rawDataAddress.wards &&
      rawDataAddress.specificAddress
    ) {
      await db.Address.create({
        userId: userId,
        provinceId: rawDataAddress.provinceId,
        districtId: rawDataAddress.districtId,
        wardsId: rawDataAddress.wardsId,
        province: rawDataAddress.province,
        district: rawDataAddress.district,
        wards: rawDataAddress.wards,
        specificAddress: rawDataAddress.specificAddress,
      });
    } else {
      return {
        EM: "Please enter address",
        EC: 1,
        DT: "",
      };
    }

    return {
      EM: "Add address successfully",
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

const fetchAddressByUser = async (userId) => {
  try {
    let data = await db.Address.findAll({
      where: { userId: userId },
      attributes: [
        "id",
        "provinceId",
        "districtId",
        "wardsId",
        "province",
        "district",
        "wards",
        "specificAddress",
      ],
      raw: true,
      nest: true,
    });

    return {
      EM: "Get address successfully",
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
const deleteAddressById = async (addressId) => {
  try {
    let address = await db.Address.findOne({
      where: { id: addressId },
      raw: false,
    });
    await address.destroy();
    return {
      EM: "Delete address successfully!",
      EC: 0,
      DT: [],
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "Error from service",
      EC: 1,
      DT: [],
    };
  }
};
const updateAddress = async (rawDataAddress) => {
  try {
    let address = await db.Address.findOne({
      where: { id: rawDataAddress.addressId },
      raw: false,
    });

    if (address) {
      if (
        rawDataAddress.provinceId &&
        rawDataAddress.district &&
        rawDataAddress.wards &&
        rawDataAddress.specificAddress
      ) {
        await address.update({
          provinceId: rawDataAddress.provinceId,
          districtId: rawDataAddress.districtId,
          wardsId: rawDataAddress.wardsId,
          province: rawDataAddress.province,
          district: rawDataAddress.district,
          wards: rawDataAddress.wards,
          specificAddress: rawDataAddress.specificAddress,
        });
      } else {
        return {
          EM: "Please enter",
          EC: 1,
          DT: "",
        };
      }

      return {
        EM: "Update address successfully",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Address not found",
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
  fetchAllProvinces,
  fetchDistrictsByProvince,
  fetchWardsByDistrict,
  createNewAddress,
  fetchAddressByUser,
  deleteAddressById,
  updateAddress,
};
