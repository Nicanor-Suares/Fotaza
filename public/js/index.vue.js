const userDefault = {
	id: null,
	nombre: '',
	email: '',
	usuario: '',
	avatar: ''
}

const postDefault = {
  post_id: null,
  user_id: null,
  title: '',
  categoria_id: 0,
  description: '',
  creation_date: '',
  format: '',
  rights: null,
  image: '',
  tags: [],
  likes: 0,
  watermark: '',
}

var vueApp = new Vue({
  el: '#app',
  data: {
    estado: 0,
    estados: {
      0: 'listar',
      1: 'newPost'
    },
    usuario: JSON.parse(JSON.stringify(userDefault)),
    post: JSON.parse(JSON.stringify(postDefault)),
    posts: [],
    categories: [],
    tags: [],
  },
  methods: {
    getUser() {
      fetch("/users/13", {
        method: "GET",
  
      }).then(response => response.json())
      .then(data => {
        this.usuario = data;
        const imageUrl = this.usuario.avatar;
        const imageName = imageUrl.split('\\').pop();
        const url = '/avatars/' + imageName;
        this.usuario.avatar = url;
      })
    },
    getAllPosts() {
      fetch("/posts/getAll", {
        method: "GET",
      }).then(response => response.json())
      .then(data => {
        this.posts = data;
        this.posts.forEach(post => {
          const imageUrl = post.image;
          const imageName = imageUrl.split('\\').pop();
          const url = '/posts/' + imageName;
          post.image = url;
        });
        this.posts.forEach(post => {
          const imageUrl = post.Usuario.avatar;
          const imageName = imageUrl.split('\\').pop();
          const url = '/avatars/' + imageName;
          post.Usuario.avatar = url;
        });
        console.log(this.posts[0]);
      })
    },
    createPost() {
      fetch("/posts/create", {
        method: "POST",
        body: JSON.stringify(this.post),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json())
      .then(data => {
        console.log(data);
        this.estado = 0;
        this.getAllPosts();
      })
    },
    subirImagen(){
      this.post.image = this.$refs.image.files[0];
    },
    newPost() {
      this.estado = this.estados.newPost;
      this.getCategories();
      this.getTags();
    },
    cancelPost() {
      console.log('cancelar');
      this.estado = 0;
      this.post = JSON.parse(JSON.stringify(postDefault));
    },
    getCategories() {
      fetch("posts/getCategories", {
        method: "GET",
      }).then(response => response.json())
      .then(data => {
        this.categories = data;
      })
    },
    getTags() {
      fetch("posts/getTags", {
        method: "GET",
      }).then(response => response.json())
      .then(data => {
        this.tags = data;
      })
    },
  },
  mounted() {
    this.getUser();
    this.getAllPosts();
  }
})