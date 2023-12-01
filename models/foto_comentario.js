module.exports = (sequelize, DataTypes) => {
  const Foto_Comentario = sequelize.define('Foto_comentario', {
    comentario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return {name : 'Foto_comentario', schema : Foto_Comentario};
};
