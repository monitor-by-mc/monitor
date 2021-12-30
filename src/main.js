import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Monitor from './monitor/index'

const monitor = new Monitor({
  reportUrl: 'http://baidu.com',
  delay: 3000,
  uid: 'myy',
  offLine: true,
  // beforeProccess: (error) => console.log('beforeProccess', error),
  // afterProccess: (error) => console.log('afterProccess', error),
  vueConstrutor: Vue,
  reportWarn: true,
  reportType: 'navigator'
})

console.log(monitor)

// console.log(a)

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
