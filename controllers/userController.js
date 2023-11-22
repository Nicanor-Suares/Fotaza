const userUpload = require('../libs/users');
const {models} = require('../models/index');
const userModel = models.Usuario;

const userController = {

  getUser: async (req, res) => {
    let userId = req.params.id;
    let user = await userModel.findOne({ where: { user_id: userId } });
    res.json(user);
  },

  createUser: async (req, res) => {
    
  },

  showEditUser: async (req, res) => {
    let userId = req.params.id;
    let user = await userModel.findOne({ where: { user_id: userId } });
    res.render('editUser', {title: 'Editar Usuario - Fotaza', scripts: ['configuraciones'], user});  }

}

module.exports = userController;