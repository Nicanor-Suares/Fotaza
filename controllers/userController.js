const userUpload = require('../libs/users');
const {models} = require('../models/index');
const userModel = models.Usuario;
const postModel = models.Post;
const Usuario_notificaciones = models.Usuario_notificaciones;
const rimraf  = require('rimraf');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');

const userController = {

  getUser: async (req, res) => {
    let userId = req.params.id;
    let user = await userModel.findOne({ 
      where: { user_id: userId },
      include: [
          { model: Usuario_notificaciones, as: 'Notifications', include: [
              { model: userModel, as: 'InterestedUser' },
              { model: userModel, as: 'PostOwner' },
              { model: postModel, as: 'Post' }
          ]}
      ]
    });
    res.json(user);
  },

  showEditUser: async (req, res) => {
    let user_id = req.params.id;
    let user = await userModel.findOne({ 
      where: { user_id: user_id },
      include: [
          { model: Usuario_notificaciones, as: 'Notifications', include: [
              { model: userModel, as: 'PostOwner' },
              { model: userModel, as: 'InterestedUser' },
          ]}
      ],
    });

    console.log('USUARIO', user);

    if(user.Notifications) {
      console.log('HAY NOTIFS');
      let notificationList = [];
      user.Notifications.forEach(notification => {
        console.log('OWNER ID', notification.post_owner_id);
        console.log('USER ID', user.user_id);
        if (notification.post_owner_id === user.user_id) {
            console.log(notification.notification_id);
            notificationList.push(notification);
          }
        });
        res.locals.notifications = notificationList;
        console.log('LISTA', notificationList);
    }
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