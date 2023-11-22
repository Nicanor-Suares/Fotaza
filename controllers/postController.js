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
      console.log(posts)
      res.json(posts)
    })
    .catch(err => {
      console.log(err)
    })
    return res;
  },
  getPost: (req, res) => {
    
  },
  showCreate: (req, res) => {
    
  },
  createPost: (req, res) => {
    console.log('CREATE POST');
    try {
      const user_id = 1;
      const { title, categoria_id, description, image, rights } = req.body;
      const creation_date = new Date();
      //const formato
      const format = 'jpg';
      const watermark = 'aaa';
      const likes = 100;
  
      if(title === '') {
        return res.status(400).json({ message: 'Por favor ingrese un título' });
      }
  
      if(categoria_id === 0) {
        return res.status(400).json({ message: 'Por favor seleccione una categoría' });
      } 
  
      const data = {
        user_id,
        title,
        categoria_id,
        description,
        creation_date,
        format,
        rights,
        image,
        likes,
        watermark
      }
  
      console.log(data);

      const newPost = postModel.create(data);
  
      if(newPost)
          res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Post upload failed' });
    }

  },
  updatePost: (req, res) => {
    
  },
  deletePost: (req, res) => {
    
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