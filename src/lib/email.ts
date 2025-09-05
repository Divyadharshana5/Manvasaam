const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

send();

async function send() {
  const result = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "RECEIVERS",
    subject: "Hello World",
    text: "Hello World",
  });

  console.log(JSON.stringify(result, null, 4));
}
