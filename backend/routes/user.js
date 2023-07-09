const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/sign-up", userController.postSignUpUser);

module.exports = router;
