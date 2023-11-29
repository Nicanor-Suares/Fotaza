var vueApp = new Vue({
  el: '#app',
  data: {
    user,
  },
  methods: {
    updateUser() {
      console.log(this.user);
      const formData = new FormData();
      formData.append('user_id', this.user.user_id);
      formData.append('usuario', this.user.usuario);
      formData.append('nombre', this.user.nombre);
      formData.append('email', this.user.email);
      formData.append('password', this.user.password);
      formData.append('avatar', this.user.avatar);

        fetch(`/users/edit/${this.user.user_id}`, {
          method: "POST",
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            if (data.redirectTo) {
              window.location.href = data.redirectTo;
            }
          } else {
            console.log(error);
          }
        })
        .catch(error => {
          console.error("Algo salio mal", error);
        });
    },
    subirImagen(){
      console.log('subir imagen');
      const vm = this; 
      vm.user.avatar = vm.$refs.avatar.files[0];
    },
  },
  mounted() {
  }
})