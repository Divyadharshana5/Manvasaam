const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Manvaasam",
    pass: "THE-GENERATED-APP-PASSWORD",
  },
});

send();

async function send() {
  const result = await transporter.sendMail({
    from: "YOUR-USERNAME",
    to: "RECEIVERS",
    subject: "Hello World",
    text: "Hello World",
  });

  console.log(JSON.stringify(result, null, 4));
}
