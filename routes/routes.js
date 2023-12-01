const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
// const passport = require('passport');
const passport = require("../auth/passport")


router.get("/", postController.showHome);

router.get("/post/id", postController.getPost);

module.exports = router;