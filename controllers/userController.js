const userUpload = require('../libs/users');
const {models} = require('../models/index');
const userModel = models.Usuario;
const postModel = models.Post;
const rimraf  = require('rimraf');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');

const userController = {

  getUser: async (req, res) => {
    let userId = req.params.id;
    let user = await userModel.findOne({ where: { user_id: userId } });
    res.json(user);
  },

  showEditUser: async (req, res) => {
    let userId = req.params.id;
    let user = await userModel.findOne({ where: { user_id: userId } });
    res.render('editUser', {title: 'Editar Usuario - Fotaza', scripts: ['configuraciones'], user});
  },

  editUser: async (req, res) => {
    let userId = req.params.id;
    let oldUser = await userModel.findOne({ where: { user_id: userId } });
    let success = false;

    //chequear contraseñas

    if (req.body.password !== oldUser.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword;
    }

    if(req.file) {
      const imageUrl = req.file ? req.file.path : null;
      const imageName = imageUrl.split(path.sep).pop();
      const url = '/avatars/' + imageName;
      const avatarPath = url;

      req.body.avatar = avatarPath;
      let user = await userModel.update(req.body, { where: { user_id: userId } });


      const oldAvatarPath = path.join(__dirname, '..', 'avatars', oldUser.avatar);
      
      try {
        fs.unlinkSync(oldAvatarPath);
        console.log('El avatar antiguo fue eliminado');
      } catch (err) {
        console.error('Error deleting file:', err);
      }
      
      if (user)
        success = true;

    } else {
      let user = await userModel.update(req.body, { where: { user_id: userId } });
      if (user)
        success = true;
    }

    if(success) {
      res.json({success: true, redirectTo: '/users/edit/' + userId});
    } else {
      res.json({success: false});
    }
  },

  showProfile: async (req, res) => {
    try {
      let userId = req.params.id;
  
      let posts = await postModel.findAll({
        where: { user_id: userId },
        include: [
          { model: userModel, as: 'Usuario' },
        ],
      });
  
      res.render('perfil', { title: 'Perfil - Fotaza', scripts: ['profile'], content: posts });
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  }
  

}

module.exports = userController;