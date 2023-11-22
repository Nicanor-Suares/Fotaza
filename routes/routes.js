const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
// const passport = require('passport');
const passport = require("../auth/passport")


router.get("/", postController.showHome);

// router.get("/", (req, res, next) => {
//   passport.authenticate("jwt", { session: false }, (err) => {
//     if (err) {
//       console.log("JWT Authentication Error:", err);
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     // If authentication succeeds, proceed with your route logic.
//   })(req, res, next);
// }, postController.getAllPosts);


// router.get("/", (req, res) => {
//   console.log(passport);
//   res.json({msg: 'hello'});
// });

router.get("/post/id", postController.getPost);

module.exports = router;