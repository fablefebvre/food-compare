// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data () {
    return {
      search: '',
      categories: []
    }
  },
  mounted () {
    axios
      .get('http://localhost:4000/api/categoriesTax')
      .then(response => (this.categories = response.data))
  },
  router,
  components: { App },
  template: '<App/>'
})
console.log(this.categories)