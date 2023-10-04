module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  return {name : 'Usuario', schema : Usuario};
}