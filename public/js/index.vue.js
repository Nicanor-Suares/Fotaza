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
    postToDelete: null,
    postToEdit: null,
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
        console.log(this.posts);
      })
    },
    createPost() {
      const formData = new FormData();
      formData.append('user_id', '1');
      formData.append('title', this.post.title);
      formData.append('categoria_id', this.post.categoria_id);
      formData.append('description', this.post.description);
      formData.append('creation_date', new Date());
      formData.append('format', '');
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
      console.log('subir imagen');
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
    abrirModalBorrar(post_id){
      event.preventDefault();
      this.postToDelete = post_id;
      $('#deleteConfirmationModal').modal('show');
    },
    deletePost(){
      fetch(`/posts/delete/${this.postToDelete}`, {
        method: "delete",
      }).then(response => response.json())
      .then(data => {
        if(data.success){
          this.cerrarModalBorrar();
          this.getAllPosts();
        }
      })
    },
    cerrarModalBorrar(){
      // event.preventDefault();
      $('#deleteConfirmationModal').modal('hide');
    },
    abrirModalEditar(post_id){
      event.preventDefault();
      this.getCategories();
      this.getTags();
      fetch(`/posts/get/${post_id}`, {
        method: "GET",
      }).then(response => response.json())
      .then(data => {
        this.postToEdit = data;
        console.log('postToEdit', this.postToEdit);
        console.log('tags', this.postToEdit.Tags[0].tag_id);
      })
      $('#editPostModal').modal('show');
    },
    editPost(){
      const formData = new FormData();
      formData.append('post_id', this.post.post_id);
      formData.append('user_id', '1');
      formData.append('title', this.post.title);
      formData.append('categoria_id', this.post.categoria_id);
      formData.append('description', this.post.description);
      formData.append('creation_date', new Date());
      formData.append('format', '');
      formData.append('rights', this.post.rights);
      formData.append('image', this.post.image);
      formData.append('tags', this.post.tags);
      formData.append('likes', '0');
      formData.append('watermark', 'aaa');

      fetch("/posts/edit", {
        method: "POST",
        body: formData,
      }).then(response => response.json())
      .then(data => {
        if(data.success){
          this.cerrarModalEditar();
          this.getAllPosts();
        }
      })
    }
    ,
    cerrarModalEditar(){
      // event.preventDefault();
      $('#editPostModal').modal('hide');
    }
  },
  mounted() {
    this.getUser();
    this.getAllPosts();
  }
})