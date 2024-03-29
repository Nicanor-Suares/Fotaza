const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userUpload = require('../libs/users');

router.get('/:id', userController.getUser);

router.get('/edit/:id', userController.showEditUser);
router.post('/edit/:id', userUpload, userController.editUser);

router.get('/profile/:id', userController.showProfile);

//router.post('/edituser/:id', userController.editUser);

module.exports = router;