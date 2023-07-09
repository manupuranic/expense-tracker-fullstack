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

exports.postLoginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findAll({ where: { email: email } });
    if (user.length === 0) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
    } else {
      if (user[0].password !== password) {
        res.status(401).json({
          message: "Password do not match",
          success: false,
        });
      } else {
        res.json({
          message: "User logged in Successfully",
          success: true,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
