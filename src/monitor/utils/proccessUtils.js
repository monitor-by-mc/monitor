export function reportErrorByOptions(type, config) {
  const _config = config
  if (type === 'normal') {
    if (!_config.delay) {
      const _image = new Image()
      _image.src = _config.reportUrl
    } else {
      if (typeof _config.delay !== 'number') return
      setTimeout(() => {
        const _image = new Image()
        _image.src = _config.reportUrl
      }, _config.delay)
    }
  } else {
    window.navigator.sendBeacon(
      _config.reportUrl,
      JSON.stringify(catchErrorOptions)
    )
  }
}
