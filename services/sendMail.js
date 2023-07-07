const nodemailer = require("nodemailer");

const sendEMail = async (email, subject, text) => {
  console.log("check env", process.env.USER);
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.HOST,
      port: 465,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const options = {
      from: "Slidecity<support@slidecity.com>",
      to: email,
      subject: subject,
      text: text,
    };

    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.log("error", error);
        return error;
      } else {
        console.log("sdfsd", info);
        return res.status(200).json({ success: true });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEMail;
