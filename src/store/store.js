import Vue from 'vue'
import Vuex from 'vuex'
import menu from '../modules/menu'
import config from '../modules/config'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    pageTitle: '未完成',
    menu: menu,
    tempTask: {
      ID: null,
      FROM: null,
      TO: null,
      CONTENT: null,
      BEGIN: null,
      END: null
    },
    userName: '',
    config: config,
    dark: false
  },
  mutations: {
    setUserName (state, data) {
      state.userName = data
    },
    setMenu (state, data) {
      state.menu = data
    },
    setPageTitle (state, data) {
      state.pageTitle = data
    },
    setTempTask (state, task) {
      state.tempTask = task
    },
    setDark (state, dark) {
      state.dark = dark
    }
  },
  actions: {
    setAuth ({commit}, userName) {
      commit('setUserName', userName)
      global.helper.localStorageManager.set('userName', userName)
    },
    setTempTask ({commit}, task) {
      commit('setTempTask', task)
    },
    setDark ({commit}, dark) {
      global.helper.localStorageManager.set('dark', dark)
      commit('setDark', dark)
    },
    checkAuth ({commit}) {
      let data = global.helper.localStorageManager.get('userName')
      commit('setUserName', data)
    },
    clearAuth ({commit}) {
      global.helper.localStorageManager.clear()
      commit('setUserName', '')
    },
    checkDark ({commit}) {
      let dark = global.helper.localStorageManager.get('dark')
      commit('setDark', dark)
    },
    checkPageTitle ({commit, state}, path) {
      let temp = 0
      for (let i in state.menu) {
        if (state.menu[i].href === path) {
          commit('setPageTitle', state.menu[i].title)
          temp = 1
          break
        }
      }
      if (temp === 0) {
        if (path.indexOf('/', 2) > -1 && !(path.indexOf('edit') > -1)) {
          commit('setPageTitle', '详情')
        } else {
          if (path.indexOf('add') > -1) {
            commit('setPageTitle', '发送')
          } else {
            commit('setPageTitle', '编辑')
          }
        }
      }
    }
  }
})

export default store
