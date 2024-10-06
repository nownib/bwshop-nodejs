import db from "../models/index";

const addContact = async (data) => {
  if (
    data &&
    data.name &&
    data.email &&
    data.message &&
    data.phone &&
    data.subject
  ) {
    await db.Contact.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
  } else {
    return {
      EM: "Please fill in all the necessary information!",
      EC: 1,
      DT: "",
    };
  }
  return {
    EM: "Contact request sent successfully",
    EC: 0,
    DT: "",
  };
};

module.exports = { addContact };
