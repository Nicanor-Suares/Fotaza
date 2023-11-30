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
  createPost: async (req, res) => {
    try {
      const { user_id, title, categoria_id, description, rights, watermark, likes, tags} = req.body;
      const creation_date = new Date();
      let success = false;
  
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
  
      let newPost = await postModel.create({user_id, title, categoria_id, description, creation_date, format, watermark, likes, image: imagePath, rights});
  
      console.log('New post created:', newPost);

      if(newPost){
        if (tags && tags.length > 0) {
          console.log('Adding tags to post...');
          console.log('Tags:', tags);

          let post = await postModel.findOne({ where: { post_id: newPost.post_id } });

          for (const tagId of tags) {
            const tagInstance = await tagsModel.findByPk(tagId);
            if (tagInstance) {
              await post.addTags(tagInstance);
            }
          }

          success = true;
        }
      }

      if(success)
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
      
      const post = await postModel.findByPk(id, { include: 'Tags' });
  
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found.' });
      }
  
      // Borrar tags
      if (post.Tags && post.Tags.length > 0) {
        await post.removeTags(post.Tags);
      }
  
      await postModel.destroy({ where: { post_id: id } });
  
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Ocurrió un error al eliminar el post.' });
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