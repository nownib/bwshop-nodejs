import contactApiService from "../service/contactApiService";

const handleAddContact = async (req, res) => {
  try {
    let dataForm = req.body;
    let data = await contactApiService.addContact(dataForm);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: "",
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
  handleAddContact,
};
