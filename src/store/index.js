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
    activeAdminMenu: 'admin-dashboard',
    activeTopic: '51mcu',
    activeTag: 'news'
  },
  mutations: {
    setLogin(state, data){
      state.login = data
    },
    setActiveMenu(state, data){
      state.activeMenu = data
    },
    setActiveAdminMenu(state, data){
      state.activeAdminMenu = data
    },
    setActiveTopic(state, data){
      state.activeTopic = data
    },
    setActiveTag(state, data){
      state.activeTag = data
    },
    initLogin(state, data){
      // eslint-disable-next-line no-console
      console.log(data);
      state.isLogin = true;
      state.avatarURL = data.avatarURL;
      state.nickname = data.nickname;
      state.token = data.token;
      state.account = data.account;
      state.role = data.weights;
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('avatarURL', data.avatarURL);
      localStorage.setItem('nickname', data.nickname);
      localStorage.setItem('account', data.account);
      localStorage.setItem('x-auth-token', data.token);
      localStorage.setItem('role', data.weights);
    },
    logout(state){
      state.isLogin = false;
      state.avatarURL = '';
      state.nickname = '';
      state.token = '';
      state.account = '';
      state.role = '';
      localStorage.removeItem('isLogin');
      localStorage.removeItem('avatarURL');
      localStorage.removeItem('nickname');
      localStorage.removeItem('account');
      localStorage.removeItem('x-auth-token');
      localStorage.removeItem('role');
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
        state.role = Number(localStorage.getItem('role'));
      }
      return state.isLogin
    },
    hasPermissions:(state)=>(scenes)=>{
      let hasPermissions = false;
      if (state.role) {
        switch (scenes) {
          case 'user':
            hasPermissions = state.role < 2;
            break;
          case 'role':
            hasPermissions = state.role < 2;
            break;
          case 'topic':
            hasPermissions = state.role < 3;
            break;
          case 'tag':
            hasPermissions = state.role < 3;
            break;
          case 'admin':
            hasPermissions = state.role < 2;
            break;
          case 'blog_admin':
            hasPermissions = state.role < 3;
            break;
          default:
            hasPermissions = state.role < 4;
        }
      }
      return hasPermissions;
    }
  }
})
