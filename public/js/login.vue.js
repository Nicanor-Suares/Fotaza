const userDefault = {
	id: null,
	usuario: '',
	nombre: '',
	email: '',
  password: '',
  confirm_password: '',
	avatar: ''
}

const userLoginDefault = {
	email: '',
  password: '',
}


var vueApp = new Vue({
  el: '#app',
  data: {
    usuario: JSON.parse(JSON.stringify(userDefault)),
    usuarioLogin: JSON.parse(JSON.stringify(userLoginDefault)),
  },
  methods: {
    loadAvatar() {
      const vm = this; 
      vm.usuario.avatar = vm.$refs.avatar.files[0];
    },
    async registerUser() {
      const formData = new FormData();
      formData.append('usuario', this.usuario.usuario);
      formData.append('nombre', this.usuario.nombre);
      formData.append('email', this.usuario.email);
      formData.append('password', this.usuario.password);
      formData.append('confirm_password', this.usuario.confirm_password);
      formData.append('avatar', this.usuario.avatar);

        fetch("/auth/register", {
          method: "POST",
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.href = '/auth/login';
          } else {
            console.log(error);
          }
        })
        .catch(error => {
          console.error("Algo salio mal", error);
        });
    },
    async loginUser() {      
      const data = {
        email: this.usuarioLogin.email,
        password: this.usuarioLogin.password,
      };
      fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.token) {
          window.location.href = '/';
        } else {
          console.log("Error:", data.error);
        }
      }).catch(error => {
        console.error("Algo salio mal", error);
      });
    },
  },
  mounted() {
  }
});