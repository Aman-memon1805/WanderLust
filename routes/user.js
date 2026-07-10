const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressErrors.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.signupForm)
.post( wrapAsync(userController.signupUser));

router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl ,passport.authenticate("local",{failureRedirect : "/users/login", failureFlash : true }), wrapAsync(userController.loginUser));

router.get("/logout",userController.logout);

module.exports = router;