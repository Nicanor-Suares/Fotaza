module.exports = (sequelize, DataTypes) => {
  const Foto_Tag = sequelize.define("Foto_tag", {
    foto_tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false
  });
  return {name : 'Foto_tag', schema : Foto_Tag};
}