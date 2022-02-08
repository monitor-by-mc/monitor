export function initGlobalError(Monitor) {
  Monitor.prototype._catchGlobalError = function () {
    if (typeof window === 'undefined') return
    const config = this._config
    // 获取全局错误
    window.addEventListener('error', (error) => {
      console.log('window error and before proccess: ', error)
      //执行钩子函数
      beforeProccess(this, config)
      //正式处理错误
      this._proccessError('windowError', error)
      //执行钩子函数
      afterProccess(this, config)
    }, true)

    //获取 Promise 没 reject 的错误
    window.addEventListener('unhandledrejection', (error) => {
      // 这个事件对象有两个特殊的属性：
      console.log('unhandledrejection: ', error)
      beforeProccess(this, config)
      //正式处理错误
      this._proccessError('unhandledrejection', error)
      //执行钩子函数
      afterProccess(this, config)
    })

    //获取 Vue 的全局错误
    let that = this
    if (config.vueConstrutor !== null) {
      if (typeof config.vueConstrutor === 'function') {
        const Vue = config.vueConstrutor
        /**
         * @param {*} err handle error
         * @param {*} vm
         * @param {*} info `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
         */
        Vue.config.errorHandler = function (err, vm, info) {
          //执行钩子函数
          beforeProccess(that, config)
          that._proccessError('vueError', err, vm, info)
          afterProccess(that, config)
        }

        /**
         * @param {*} msg
         * @param {*} vm
         * @param {*} trace 是组件的继承关系追踪
         */
        Vue.config.warnHandler = function (msg, vm, trace) {
          if (config.reportWarn) {
            beforeProccess(that, config)
            that._proccessError('vueWarn', msg, vm, trace)
            afterProccess(that, config)
          }
        }
      } else {
        console.error(`[monitor error]: vueConstrutor must be Function Vue`)
      }
    }
  }
}

function beforeProccess(instance, config) {
  if (config.beforeProccess && typeof config.beforeProccess === 'function') {
    instance.beforeProccess(error)
  }
}

function afterProccess(instance, config) {
  if (config.afterProccess && typeof config.afterProccess === 'function') {
    instance.afterProccess(error)
  }
}
