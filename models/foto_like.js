module.exports = (sequelize, DataTypes) => {
  const Foto_like = sequelize.define('Foto_like', {
    like_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
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

  return {name : 'Foto_like', schema : Foto_like};
};
