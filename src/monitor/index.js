import { initMixin } from './mixins/index'
import { initGlobalError } from './errors/global-error'
import listen from './listener'

function Monitor(options, addReportOptions) {
  if (
    Object.prototype.toString.call(options) !== '[object Object]' ||
    JSON.stringify(options) === '{}'
  ) {
    throw new Error(
      '[Monitor init error]: options is not an object type or options is an empty object'
    )
  }
  this._initConfig(options, addReportOptions)
  this._initMethod()
  this._initIndexedDb()
  this._catchGlobalError()
}

initMixin(Monitor)
initGlobalError(Monitor)
listen() // 开启监听，捕获信息

export default Monitor
