const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

exports.postForgotPassword = async (req, res, next) => {
  const email = req.body.email;
  const client = SibApiV3Sdk.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

  const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  const sender = {
    email: "manupuranic@gmail.com",
    name: "Expense-Tracker",
  };
  const receivers = [
    {
      email: email,
    },
  ];
  try {
    const response = await transEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Testing the sendinblue mail api",
      textContent:
        "Testing the mail api, through expense-tracker for forgot password",
    });
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};
