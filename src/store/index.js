import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    version: '1.0.0',
    isInit: false,
    name: '',
    nickname: '',
    blogTitle: '',
    avatarURL: '',
    blogURL: '/',
    role: 0, // 0-no login, 1-admin, 2-blog admin, 3-blog user, 4-visitor
    blogs: [{
      title: '',
      id: ''
    }],
    snackMsg: '',
    snackBar: false,
    snackModify: 'error',
    menu: [],
    tagsItems: [],
    bodySide: '',
    login: false,
    activeMenu: 'home'
  },
  mutations: {
    setLogin(state, data){
      state.login = data
    },
    setActiveMenu(state, data){
      state.activeMenu = data
    }
  },
  actions: {
  },
  modules: {
  }
})
