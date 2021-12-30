export function mergeOption(oldOption, newOption) {
  let copy = JSON.parse(JSON.stringify(oldOption))
  if (
    Object.prototype.toString.call(newOption) !== '[object Object]' ||
    JSON.stringify(newOption) === '{}'
  ) {
    return copy
  }
  const keys = Object.keys(newOption)
  for (let i = 0; i < keys.length; i++) {
    copy[keys[i]] = newOption[keys[i]]
  }
  return copy
}

export function splicingUrl(objParams) {
  if (Object.prototype.toString.call(objParams) !== '[object Object]') return
  const keys = Object.keys(objParams)
  let url = '?'
  keys.forEach((key) => {
    if (Object.prototype.toString.call(objParams[key]) === '[object Object]') {
      url += key + '=' + JSON.stringify(objParams[key]) + '&'
    } else {
      url += key + '=' + objParams[key] + '&'
    }
  })
  url = url.substring(url.length - 1, 0)
  return url
}
