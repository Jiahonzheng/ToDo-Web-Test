// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import helper from './modules/helper'
import store from './store/store'
import Vuetify from 'vuetify'
import 'vuetify/src/stylus/main.styl'
import 'vuetify/src/stylus/settings/_colors.styl'
import '@/styles/main.styl'

global.helper = helper
global.store = store

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
})
