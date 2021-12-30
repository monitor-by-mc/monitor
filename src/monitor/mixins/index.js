import { beforeProccess, afterProccess } from '../hook/index'
import { processError } from '../processError/index'
import { initIndexedDb } from '../indexedDb/index'
import { getOsInfo, getBrowser } from '../utils/browser'
import { mergeOption } from '../utils/proccessVariables'

export function initMixin(Monitor) {
  Monitor.prototype._initConfig = function (options, addReportOptions) {
    this._options = options
    this._config = {
      reportUrl: options.reportUrl || '',
      reportType: options.reportType || 'normal', // normal - 使用创建image标签的形式 get方法上传， 'navigator - 使用navigator的方法上报，只支持post方法
      ignore: options.ignore || [],
      delay: options.delay || '', //延迟上报的时间,以ms为单位
      logsList: [],
      offLine: false,
      reportWarn: false
    }
    this._errorOptions = {
      id: new Date().getTime(), //timestamp 作为 errorID
      uid: localStorage.getItem('monitor_uid') || options.uid || 'MonitorUser', //用户标识
      osInfo: getOsInfo(),
      browser: getBrowser()
    }
    if (
      options &&
      Object.prototype.toString.call(options) === '[object Object]'
    ) {
      {
        const increase = mergeOption(this._config, options)
        this._config = increase
      }
    }
    if (
      addReportOptions &&
      Object.prototype.toString.call(addReportOptions) === '[object Object]'
    ) {
      {
        const increase = mergeOption(this._errorOptions, addReportOptions)
        this._errorOptions = increase
      }
    }
    //初始化Monitor时触发回调函数
    if (this._config.callback && typeof this._config.callback === 'function') {
      this._config.callback()
    }
  }

  Monitor.prototype._initMethod = function () {
    this.beforeProccess = beforeProccess
    this.afterProccess = afterProccess
    this._initIndexedDb = initIndexedDb
    this._proccessError = processError
  }
}
