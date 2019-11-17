import Vue from 'vue'
import Qs from 'qs'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/element.js'
import vueAxios from './plugins/axios'

Vue.prototype.qs = Qs;
Vue.use(vueAxios());

Vue.config.productionTip = false;

router.afterEach(() => {
  window.scrollTo(0, 0)
});

window.app = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
