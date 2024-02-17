const {models} = require('../models/index');
const postModel = models.Post;
const userModel = models.Usuario;
const categoriasModel = models.Categorias;
const tagsModel = models.Tags;
const fotoTagModel = models.Foto_tag;
const fotoComentModel = models.Foto_comentario;
const fotoLikeModel = models.Foto_like;


const getRatingAverage = async (post_id) => {
  try {
    const ratings = await fotoLikeModel.findAll({
      where: {
        post_id: post_id
      },
      attributes: ['rating']
    });

    let totalRating = 0;
    ratings.forEach((rating) => {
      totalRating += rating.rating;
    });
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    const post = await postModel.findByPk(post_id);
    if (post) {
      post.average_likes = averageRating;
      await post.save();
      return averageRating;
    } else {
      console.error('Post not found');
      return null;
    }

  } catch (error) {
    console.error('Error calculating average rating:', error);
    return null;
  }
};

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
        { model: fotoComentModel, as: 'Foto_comentarios', include: [{ model: userModel, as: 'Usuario' }] },
        { model: fotoLikeModel, as: 'Foto_likes', include: [{ model: userModel, as: 'Usuario' }] }
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
        { model: fotoComentModel, as: 'Foto_comentarios' },
      ],
    }).then(post => {
      res.json(post)
    })
    .catch(err => {
      console.log(err)
    })
    return res;
  },
  createPost: async (req, res) => {
    try {
      const { user_id, title, categoria_id, description, rights, watermark, likes, average_likes, tags} = req.body;
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
  
      let newPost = await postModel.create({user_id, title, categoria_id, description, creation_date, format, watermark, likes, average_likes, image: imagePath, rights});
  
      if(newPost){
        if (tags && tags.length > 0) {
          console.log('Adding tags to post...');

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
  },

  //Comentarios
  addComment: (req, res) => {
    const { post_id, user_id, comentario } = req.body;

    fotoComentModel.create({
      post_id,
      user_id,
      comentario,
    })
    .then(comment => {
      res.json( { success: true, comment });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to create comment' });
    });
  },
  deleteComment: (req, res) => {
    const commentId = req.params.id;

    fotoComentModel.destroy({
      where: {
        comentario_id: commentId,
      },
    })
      .then(() => {
        res.json({ success: true, message: 'Comment deleted successfully' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete comment' });
      });
  },
  ratePost: async (req, res) => {
    const post_id = req.params.id;

    const { user_id, rating } = req.body;

    if (!post_id || !rating || !user_id) return res.status(500).json({ error: 'Failed to rate post' });

    if (rating > 5) rating = 5
    if (rating < 1) rating = 1
  
    let savedRating = await fotoLikeModel.findOne({ where: { post_id: post_id, user_id: user_id } });

    if (savedRating) {
      console.log('Updating rating...');
      savedRating.rating = rating
      await savedRating.save()
    } else {
      console.log('Creating new rating...');
      savedRating = await fotoLikeModel.create({ post_id: post_id, user_id: user_id, rating: rating })
    }

    res.json( { success: true, savedRating, average: await getRatingAverage(post_id)});
  },

}

module.exports = postController;