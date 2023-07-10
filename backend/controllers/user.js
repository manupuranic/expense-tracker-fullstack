const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.postSignUpUser = async (req, res, next) => {
  const { userName, email, password } = req.body;
  try {
    const user = await User.findAll({ where: { email: email } });
    if (user.length !== 0) {
      res.json({
        message: "User already exists!",
      });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        console.log(err);
        const result = await User.create({
          userName: userName,
          email: email,
          password: hash,
        });
        res.json(result.dataValues);
      });
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
      const result = await bcrypt.compare(password, user[0].password);
      if (result === true) {
        res.json({
          message: "User logged in Successfully",
          success: true,
        });
      } else {
        res.status(401).json({
          message: "Password do not match",
          success: false,
        });
      }
    }
  } catch (err) {
    res.json({
      success: false,
      message: err,
    });
  }
};
