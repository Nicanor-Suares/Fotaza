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
      fetch("/users/14", {
        method: "GET",
  
      }).then(response => response.json())
      .then(data => {
        this.usuario = data;
      })
    },
    getAllPosts() {
      fetch("/posts/getAll", {
        method: "GET",
      }).then(response => response.json())
      .then(data => {
        this.posts = data;
        console.log(this.posts[0]);
      })
    },
    createPost() {
      const formData = new FormData();
      formData.append('user_id', '14');
      formData.append('title', this.post.title);
      formData.append('categoria_id', this.post.categoria_id);
      formData.append('description', this.post.description);
      formData.append('creation_date', new Date());
      formData.append('format', 'jpg');
      formData.append('rights', this.post.rights);
      formData.append('image', this.post.image);
      formData.append('tags', this.post.tags);
      formData.append('likes', '0');
      formData.append('watermark', 'aaa');

      fetch("/posts/create", {
        method: "POST",
        body: formData,
      }).then(response => response.json())
      .then(data => {
        console.log(data);
        this.estado = 0;
        this.getAllPosts();
      })
    },
    subirImagen(){
      const vm = this; 
      vm.post.image = vm.$refs.image.files[0];
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