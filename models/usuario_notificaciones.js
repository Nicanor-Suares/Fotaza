module.exports = (sequelize, DataTypes) => {
  const Usuario_notificaciones = sequelize.define("Usuario_notificaciones", {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    interested_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    post_owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });
  return {name : 'Usuario_notificaciones', schema : Usuario_notificaciones};
}