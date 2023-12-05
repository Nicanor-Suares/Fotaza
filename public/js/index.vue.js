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
  rights: 0,
	image: '',
  tags: [],
  comments: [],
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
    allPosts: [],
    newComment: '',
    categories: [],
    tags: [],
    selectedTags: [],
    rating: 0,
    // radioId: `rating-${this.post.post_id}`,
    postToDelete: null,
    postToEdit: null,
    isAuthenticated: false,
    loggedUser_id: user_id
  },
  methods: {
    async getUser() {
      try {
        if (!user_id) {
          this.isAuthenticated = false;
        } else {
          const response = await fetch(`/users/${user_id}`, { method: "GET" });
          const data = await response.json();
          this.usuario = data;
          this.isAuthenticated = true;
        }
    
        await this.postsAuth(this.isAuthenticated);
      } catch (error) {
        console.error(error);
      }
    },
    async getAllPosts() {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await fetch("/posts/getAll", { method: "GET" });
          const data = await response.json();
          this.posts = data;
          this.allPosts = data;
          resolve();
        } catch (error) {
          console.error(error);
          reject(error);
        }
      });
    },
    async getPost(post_id) {
      return fetch(`/posts/getPost/${post_id}`, {
        method: "GET",
      }).then(response => response.json());
    },
    async postsAuth(isAuthenticated) {
      await this.getAllPosts();
      if(isAuthenticated) {
        this.posts = this.allPosts;
      } else {
        this.posts = this.allPosts.filter(post => post.rights === 0);
      }
    },
    sortBy(order) {
      if (order === 'recent') {
        this.posts.sort((a, b) => b.post_id - a.post_id); // Sort by post_id in descending order (most recent first)

      } else if (order === 'old') {
        this.posts.sort((a, b) => a.post_id - b.post_id); // Sort by post_id in ascending order (oldest first)
      }
    },
    filterByCategory(categoryId) {
      if (categoryId === 'all') {
        this.posts = this.allPosts;
      } else {
        this.posts = this.allPosts.filter(post => post.categoria_id === categoryId);
      }
    },
    createPost() {
      const formData = new FormData();
      formData.append('user_id', this.loggedUser_id);
      formData.append('title', this.post.title);
      formData.append('categoria_id', this.post.categoria_id);
      formData.append('description', this.post.description);
      formData.append('creation_date', new Date());
      formData.append('format', '');
      formData.append('rights', this.post.rights);
      formData.append('image', this.post.image);
      formData.append('tags', this.selectedTags);
      formData.append('likes', '0');
      formData.append('watermark', 'aaa');

      fetch("/posts/create", {
        method: "POST",
        body: formData,
      }).then(response => response.json())
      .then(data => {
        if(data.success) {
          this.estado = 0;
          window.location.href = '/';
        }
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
      this.estado = 0;
      this.post = JSON.parse(JSON.stringify(postDefault));
    },
    async addComment(post_id) {
      try {
        let post = await this.getPost(post_id);
    
        const commentData = {
          post_id: post.post_id,
          user_id: this.loggedUser_id,
          comentario: this.newComment,
        }; 
    
        const response = await fetch("/posts/addComment", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentData),
        });
    
        const data = await response.json();
    
        if (data.success) {
          this.estado = 0;
          window.location.href = '/';
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
    },    
    async deleteComment(post_id) {
      try {    
        const response = await fetch(`/posts/deleteComment/${post_id}`, {
          method: "delete",
        });
    
        const data = await response.json();
    
        if (data.success) {
          this.estado = 0;
          window.location.href = '/';
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
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
    handleTagSelection() {
      if (this.selectedTags.length > 3) {
        this.selectedTags.pop();
      }
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
      fetch(`/posts/getPost/${post_id}`, {
        method: "GET",
      }).then(response => response.json())
      .then(data => {
        this.postToEdit = data;
        
        if (this.postToEdit.Tags.some(tag => tag.tag_id === (this.tags[0] && this.tags[0].tag_id))) {
        }      
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
  },
})