import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.http = Vue.prototype.$http = axios

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
