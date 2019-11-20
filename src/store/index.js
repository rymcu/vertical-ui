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
    activeMenu: 'home',
    activeTag: 'news'
  },
  mutations: {
    setLogin(state, data){
      state.login = data
    },
    setActiveMenu(state, data){
      state.activeMenu = data
    },
    setActiveTag(state, data){
      state.activeTag = data
    },
    initLogin(state, data){
      state.isLogin = true;
      state.avatarURL = data.avatarURL;
      state.nickname = data.nickname;
      state.token = data.token;
      state.account = data.account;
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('avatarURL', data.avatarURL);
      localStorage.setItem('nickname', data.nickname);
      localStorage.setItem('account', data.account);
      localStorage.setItem('x-auth-token', data.token);
    },
    logout(state){
      state.isLogin = false;
      state.avatarURL = '';
      state.nickname = '';
      state.token = '';
      state.account = '';
      localStorage.removeItem('isLogin');
      localStorage.removeItem('avatarURL');
      localStorage.removeItem('nickname');
      localStorage.removeItem('account');
      localStorage.removeItem('x-auth-token');
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    isLogin(state){
      if (!state.isLogin) {
        state.isLogin = localStorage.getItem('isLogin');   //从sessionStorage中读取状态
        state.nickname = localStorage.getItem('nickname');
        state.avatarURL = localStorage.getItem('avatarURL') !== 'undefined'?localStorage.getItem('avatarURL'):"";
        state.token = localStorage.getItem('x-auth-token');
        state.account = localStorage.getItem('account');
      }
      return state.isLogin
    }
  }
})
