const {models} = require('../models/index');
const postModel = models.Post;
const userModel = models.Usuario;
const categoriasModel = models.Categorias;
const tagsModel = models.Tags;
const fotoTagModel = models.Foto_tag;

const postController = {

  showHome: (req, res) => {
    res.render('index', {title: 'Inicio - Fotaza', scripts: ['index']});
  },

  //Posts ABM
  getAllPosts: (req, res ) => {
    postModel.findAll({
      include: [
        { model: userModel, as: 'Usuario' },
        { model: categoriasModel, as: 'Categorias' },
        { model: tagsModel, as: 'Tags' },
      ],
    }).then(posts => {
      res.json(posts)
    })
    .catch(err => {
      console.log(err)
    })
    return res;
  },
  getPost: (req, res) => {
    postModel.findOne({
      where: { post_id: req.params.id },
      include: [
        { model: userModel, as: 'Usuario' },
        { model: categoriasModel, as: 'Categorias' },
        { model: tagsModel, as: 'Tags' },
      ],
    }).then(post => {
      res.json(post)
    })
    .catch(err => {
      console.log(err)
    })
    return res;
  },
  showCreate: (req, res) => {
    
  },
  createPost: (req, res) => {
    try {
      const { user_id, title, categoria_id, description, rights, watermark, likes} = req.body;
      const creation_date = new Date();
      //const formato
  
      if(title === '') {
        return res.status(400).json({ message: 'Por favor ingrese un título' });
      }
  
      if(categoria_id === 0) {
        return res.status(400).json({ message: 'Por favor seleccione una categoría' });
      } 
  
      const imageUrl = req.file ? req.file.path : null;
      const imageName = imageUrl.split('\\').pop();
      const url = '/posts/' + imageName;
      const imagePath = url;

      const formatMatch = imageName.match(/\.([a-zA-Z0-9]+)$/);
      const format = formatMatch ? formatMatch[1] : null;
  
      const newPost = postModel.create({user_id, title, categoria_id, description, creation_date, format, watermark, likes, image: imagePath, rights});
  
      if(newPost)
          res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Post upload failed' });
    }

  },
  updatePost: (req, res) => {
    
  },
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      await postModel.destroy({ where: { post_id: id } });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'An error occurred while deleting the post.' });
    }
  },

  //Categorías y etiquetas
  getCategories: (req, res) => {
    categoriasModel.findAll().then(categorias => {
      res.json(categorias)
    })
    .catch(err => {
      console.log(err)
    })
    return res;
  },
  getTags: (req, res) => {
    tagsModel.findAll().then(tags => {
      res.json(tags)
    })
    .catch(err => {
      console.log(err)
    })
    return res;
  }

}

module.exports = postController;