import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '@/styles/index.scss' // global css

import App from './App'
import router from './router/routers'
import permission from './components/permission'
import store from './store'

import '@/icons' // icon
// import './router/index' // permission control

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import AFTableColumn from 'af-table-column'
import notify from './mixins/notify'

// Vue.use(VXETable)
// 数据字典
import dict from './components/Dict'
import Drawer from '@/components/Drawer'
Vue.component('Drawer', Drawer)

Vue.use(codemirror)
Vue.use(AFTableColumn)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
require('babel-polyfill')

Vue.mixin(notify)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
