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

module.exports = models;
module.exports = sequelizeConnection;