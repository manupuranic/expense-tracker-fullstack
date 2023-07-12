const express = require("express");

const passwordController = require("../controllers/password");

const router = express.Router();

router.post("/forgotpassword", passwordController.postForgotPassword);

router.get("/resetpassword/:id", passwordController.getResetPassword);

router.post("/resetpassword/:id", passwordController.postResetPassword);

module.exports = router;
