// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf
// with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueHtmlToPaper from 'vue-html-to-paper'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './app.css'

Vue.config.productionTip = false

const printOptions = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    './static/paper_wallet_generator_print.css'
  ],
  timeout: 1000,
  autoClose: false,
  windowTitle: window.document.title
}

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueHtmlToPaper, printOptions)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
