module.exports = (sequelize, DataTypes) => {
  const Categorias = sequelize.define("Categorias", {
    cat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    cat_nombre: {
      type : DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false
  });
  return {name : 'Categorias', schema : Categorias};
}