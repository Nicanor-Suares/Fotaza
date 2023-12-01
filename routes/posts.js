const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const postUpload = require('../libs/posts');

//Posts ABM
router.get('/getAll', postController.getAllPosts); 
router.get('/getPost/:id', postController.getPost);
router.post('/create', postUpload, postController.createPost);
router.put('/update/:id', postUpload, postController.updatePost);
router.delete('/delete/:id', postController.deletePost);
//router.get('/get/:id', postController.getPost);


//Categorías y etiquetas
router.get('/getCategories', postController.getCategories);
router.get('/getTags', postController.getTags);

//Comments
router.post('/addComment', postController.addComment);

module.exports = router;