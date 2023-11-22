module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    categoria_id: {
      type : DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type : DataTypes.STRING,
      allowNull: false
    },
    creation_date: {
      type : DataTypes.DATE,
      allowNull: false
    },
    format : {
      type : DataTypes.STRING,
      allowNull: false
    },
    rights: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    },
    watermark: {
      type : DataTypes.STRING,
      allowNull: false
    }
  });
  return {name : 'Post', schema : Post};
}