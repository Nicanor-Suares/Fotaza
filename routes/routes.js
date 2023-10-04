const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
//const tokenHandlerMiddleware = require('../middleware/tokenHandler');

router.get("/", postController.getAllPosts);

module.exports = router;