const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userUpload = require('../libs/users');

//register
router.get("/register", authController.showRegister);
router.post("/register", userUpload, authController.register);

//login
router.get("/login", authController.showLogin);
router.post("/login", authController.login);

//logout
router.get("/logout", authController.logout);

//home
router.get("/user/home", authController.showHome);


module.exports = router;