import Vue from 'vue'
import Vuex from 'vuex'
import menu from '../modules/menu'
import config from '../modules/config'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    pageTitle: '未完成',
    menu: menu,
    message: {
      type: null,
      body: null
    },
    userName: '',
    config: config
  },
  mutations: {
    setAuth (state, userName) {
      state.userName = userName
      global.helper.localStorageManager.set('userName', userName)
    },
    setMenu (state, data) {
      state.menu = data
    },
    setPageTitle (state, data) {
      state.pageTitle = data
    },
    showMessage (state, type, body) {
      state.message = {type, body}
    }
  },
  actions: {
    checkAuth ({commit}) {
      let data = global.helper.localStorageManager.get('userName')
      commit('setAuth', data)
    },
    checkPageTitle ({commit, state}, path) {
      for (let i in state.menu) {
        if (state.menu[i].href === path) {
          commit('setPageTitle', state.menu[i].title)
          break
        }
      }
    }
  }
})

export default store
