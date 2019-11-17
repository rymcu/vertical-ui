import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: 'zh_CN',
    version: '1.0.0',
    isInit: false,
    isLogin: false,
    token: '',
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
    },
    initLogin(state, data){
      state.isLogin = true;
      state.avatarURL = data.avatarURL;
      state.nickname = data.nickname;
      state.token = data.token;
      localStorage.setItem('x-auth-token', data.token);
      // eslint-disable-next-line no-console
      console.log(data.token)
    },
    logout(state){
      state.isLogin = false;
      state.avatarURL = '';
      state.nickname = '';
      state.token = '';
      localStorage.removeItem('x-auth-token');
    }
  },
  actions: {
  },
  modules: {
  }
})
