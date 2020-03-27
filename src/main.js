import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/element.js'
import vueAxios from './plugins/axios'

Vue.use(vueAxios());

Vue.config.productionTip = false;

// 苹果微信分享兼容代码
const userAgent = navigator.userAgent;
let isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

router.beforeEach((to, from, next) => {
  if (isiOS && !(to.path === global.location.pathname || process.env.BASE_URL ? process.env.BASE_URL : '/vertical' + to.path === global.location.pathname)) {
    location.assign((process.env.BASE_URL ? process.env.BASE_URL : '/vertical' + to.fullPath).replace('//', '/'))
  } else {
    next()
  }
})

router.afterEach(() => {
  window.scrollTo(0, 0)
});

window.app = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
