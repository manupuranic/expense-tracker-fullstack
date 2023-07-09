const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/sign-up", userController.postSignUpUser);

router.post("/login", userController.postLoginUser);

module.exports = router;
