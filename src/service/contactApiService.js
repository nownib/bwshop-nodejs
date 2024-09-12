import db from "../models/index";

const addContact = async (data) => {
  await db.Contact.create({
    name: data.name,
    phone: data.phone,
    email: data.email,
    subject: data.subject,
    message: data.message,
  });

  return {
    EM: "Contact request sent successfully",
    EC: 0,
    DT: "",
  };
};

module.exports = { addContact };
