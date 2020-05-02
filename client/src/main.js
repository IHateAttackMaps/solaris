import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap'
import 'bootswatch/dist/darkly/bootstrap.min.css'

import 'pixi.js'
import 'pixi-viewport'

Vue.config.productionTip = false

Vue.use(new VueSocketio({
  debug: true,
  connection: `//localhost:3000`, // TODO: Needs to be an environment variable.
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  }
}))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
