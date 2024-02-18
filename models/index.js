const fs = require('fs');
const Sequelize = require('sequelize');
const config = require('./../config/database');

const models = {};
const sequelizeConnection = new Sequelize(config.development);

fs.readdirSync(__dirname)
.filter(file => (file.indexOf('.') !== 0) && (file !== "index.js"))
.forEach(file => {
  let model = require("./" + file)(sequelizeConnection, Sequelize);
  models[model.name] = model.schema;
});

console.log(models);

//Associations
models.Usuario.hasMany(models.Post);
models.Post.belongsTo(models.Usuario, { foreignKey: 'user_id', unique: false },);

models.Categorias.hasMany(models.Post, { foreignKey: 'categoria_id', timestamps: false });
models.Post.belongsTo(models.Categorias, { foreignKey: 'categoria_id', as: 'Categorias', timestamps: false });

models.Post.belongsToMany(models.Tags, {
  through: models.Foto_tag,
  foreignKey: 'post_id',
  as: 'Tags',
});


//Tags
models.Tags.belongsToMany(models.Post, { through: models.Foto_tag, foreignKey: 'tag_id' });
models.Foto_tag.belongsTo(models.Post, { foreignKey: 'post_id' });
models.Foto_tag.belongsTo(models.Tags, { foreignKey: 'tag_id' });
models.Post.hasMany(models.Foto_tag, { foreignKey: 'post_id', as: 'Foto_tag' });
models.Tags.hasMany(models.Foto_tag, { foreignKey: 'tag_id' });

//Comments
models.Usuario.hasMany(models.Foto_comentario, { foreignKey: 'user_id' });
models.Post.hasMany(models.Foto_comentario, { foreignKey: 'post_id' });
models.Foto_comentario.belongsTo(models.Usuario, { foreignKey: 'user_id' });
models.Foto_comentario.belongsTo(models.Post, { foreignKey: 'post_id' });

//Likes
models.Usuario.hasMany(models.Foto_like, {foreignKey: 'user_id'});
models.Post.hasMany(models.Foto_like, {foreignKey: 'post_id'});
models.Foto_like.belongsTo(models.Usuario, {foreignKey: 'user_id'});
models.Foto_like.belongsTo(models.Post, { foreignKey: 'post_id' });

//Notifications
models.Usuario.hasMany(models.Usuario_notificaciones, { foreignKey: 'post_owner_id', as: 'Notifications' });

// Define association between Usuario_notificaciones and Usuario for interested users
models.Usuario_notificaciones.belongsTo(models.Usuario, { foreignKey: 'interested_user_id', as: 'InterestedUser' });

// Define association between Usuario_notificaciones and Usuario for post owners
models.Usuario_notificaciones.belongsTo(models.Usuario, { foreignKey: 'post_owner_id', as: 'PostOwner' });

// Define association between Usuario_notificaciones and Post
models.Usuario_notificaciones.belongsTo(models.Post, { foreignKey: 'post_id', as: 'Post' });


module.exports = models;
module.exports = sequelizeConnection;