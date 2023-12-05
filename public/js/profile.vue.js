var vueApp = new Vue({
  el: '#app',
  data: {
    content: content,
    usuario: JSON.parse(JSON.stringify(userDefault)),
    post: JSON.parse(JSON.stringify(postDefault)),
    posts: [],
    loggedUser_id: user_id
  },
  methods: {
  },
  mounted() {
    this.getUser();
  },
})