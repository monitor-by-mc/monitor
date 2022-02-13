// 监听点击、双击事件
function clickListener (event) {

}
// 监听焦点事件
function focusListener (event) {

}
// 动态添加监听事件
const listen = (event, cb, canRemove) => {
  if (window.addEventListener) {
    // IE模式
    window.addEventListener(event, function listener (ev) {
      if (canRemove) {
        window.removeEventListener(event, listener, true)
      }
      cb.call(window, ev)
    }, true)
  } else if (window.attachEvent) {
    // 不支持Mozilla系列，IE8及以下
    window.attachEvent(`on${event}`, function listener (ev) {
      if (canRemove) {
        window.detachEvent(`on${event}`, listener)
      }
      cb.call(window, ev)
    })
  }
}
export default function () {
  // 监听事件
  listen('click', clickListener)
  listen('focus', focusListener)
}