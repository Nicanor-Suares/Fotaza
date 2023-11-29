module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define("Tags", {
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    tag_nombre: {
      type : DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false
  });
  return {name : 'Tags', schema : Tags};
}