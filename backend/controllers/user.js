const User = require("../models/user");

exports.postSignUpUser = async (req, res, next) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findAll({ where: { email: email } });
    if (user.length !== 0) {
      res.json({
        message: "User already exists!",
      });
    } else {
      const result = await User.create({
        userName: userName,
        email: email,
        password: password,
      });
      res.json(result.dataValues);
    }
  } catch (err) {
    console.log(err);
  }
};
