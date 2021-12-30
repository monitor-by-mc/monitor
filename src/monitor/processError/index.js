import { splicingUrl } from '../utils/proccessVariables'
const hrefRegex =
  /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i

export function processError(type, error, ...arg) {
  const config = this._config
  const errConfig = this._errorOptions
  if (type === 'windowError') {
    proccessWindowError(this, error, config, errConfig)
  }
  if (type === 'vueError') {
    proccessVueError(this, error, config, errConfig)
  }
  if (type === 'vueWarn') {
    proccessVueWarn(this, error, config, errConfig, ...arg)
  }
  if (type === 'unhandledrejection') {
    proccessUnhandledrejection(this, error, config, errConfig)
  }
}

function proccessWindowError(instance, error, config, errConfig) {
  const catchErrorOptions = dealWithErrorAndReturnOptions(error, errConfig)
  instance._config.logsList.push(catchErrorOptions)
  _proccessAndReportError(config, catchErrorOptions)
}

function proccessVueError(instance, error, config, errConfig) {
  const catchErrorOptions = dealWithErrorAndReturnOptions(error, errConfig)
  instance._config.logsList.push(catchErrorOptions)
  _proccessAndReportError(config, catchErrorOptions)
}

function proccessVueWarn(instance, error, config, errConfig, ...arg) {
  const catchErrorOptions = dealWithErrorAndReturnOptions(error, errConfig)
  catchErrorOptions.error.stack = arg[1]
    .replace(/\n/g, '')
    .replace(/\s/g, '')
    .split('at')
    .join('@')
  instance._config.logsList.push(catchErrorOptions)
  _proccessAndReportError(config, catchErrorOptions)
}

function proccessUnhandledrejection(instance, error, config, errConfig) {
  const catchErrorOptions = dealWithErrorAndReturnOptions(error, errConfig)
  catchErrorOptions.errorMessage = error.reason
  catchErrorOptions.lever = 'p0'
  instance._config.logsList.push(catchErrorOptions)
  _proccessAndReportError(config, catchErrorOptions)
}

function _proccessAndReportError(config, catchErrorOptions) {
  const _config = config
  if (!_config.reportUrl) return
  if (!hrefRegex.test(_config.reportUrl)) {
    return console.error(
      '[monitor config error]: reportUrl does not match the format of the link'
    )
  }
  // image 为GET， 而sendBeacon 为post
  if (_config.reportType === 'normal') {
    if (window.Image) {
      reportTypeByImage(_config, catchErrorOptions)
    }
  } else {
    if (window.navigator) {
      reportTypeByNavigator(_config, catchErrorOptions)
    }
  }
}

function dealWithErrorAndReturnOptions(error, errConfig) {
  const errorMessage = error
  const stack = errorMessage.error
    ? errorMessage.error.stack
        .replace(/\n/gi, '')
        .split(/\bat\b/)
        .slice(0, 9)
        .join('@')
        .replace(/\?[^:]+/gi, '')
    : errorMessage.name + ' ' + errorMessage.message + ''
  const catchErrorOptions = {
    ...errConfig,
    lever: errorMessage.message ? 'p0' : 'p4',
    errorMessage: errorMessage.message || '',
    row: errorMessage.lineno || 0,
    col: errorMessage.colno || 0,
    error: {
      message: errorMessage.message || JSON.stringify(errorMessage),
      stack
    },
    host: errorMessage.currentTarget
      ? errorMessage.currentTarget.location.host
      : window.location.host,
    href: errorMessage.currentTarget
      ? errorMessage.currentTarget.location.href
      : window.location.href,
    origin: errorMessage.currentTarget
      ? errorMessage.currentTarget.location.origin
      : window.location.origin
  }
  return catchErrorOptions
}

function reportTypeByImage(_config, catchErrorOptions) {
  if (!_config.delay) {
    const _image = new Image()
    _image.src = _config.reportUrl + splicingUrl(catchErrorOptions)
  } else {
    if (typeof _config.delay !== 'number') return
    setTimeout(() => {
      const _image = new Image()
      _image.src = _config.reportUrl + splicingUrl(catchErrorOptions)
    }, _config.delay)
  }
}

function reportTypeByNavigator(_config, catchErrorOptions) {
  if (!_config.delay) {
    window.navigator.sendBeacon(
      _config.reportUrl,
      JSON.stringify(catchErrorOptions)
    )
  } else {
    setTimeout(() => {
      window.navigator.sendBeacon(
        _config.reportUrl,
        JSON.stringify(catchErrorOptions)
      )
    }, _config.delay)
  }
}
