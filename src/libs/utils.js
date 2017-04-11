let checkPhone = function (phone) {
  return /^0?(1)\d{10}$/.test(phone)
}

let offset = function (el) {
  let box = el.getBoundingClientRect()
  let body = document.body
  let clientTop = el.clientTop || body.clientTop || 0
  let clientLeft = el.clientLeft || body.clientLeft || 0
  let scrollTop = window.pageYOffset || el.scrollTop
  let scrollLeft = window.pageXOffset || el.scrollLeft
  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  }
}

let transitionEnd = function (el, fun) {
  let arr = ['msTransitionEnd', 'mozTransitionEnd', 'oTransitionEnd', 'webkitTransitionEnd', 'transitionend']
  let handler = {
    handleEvent (event) {
      arr.forEach(function (eventName) {
        el.removeEventListener(eventName, handler, false)
      })
      fun.apply(el, arguments)
    }
  }
  arr.forEach(function (eventName) {
    el.addEventListener(eventName, handler, false)
  })
}

let merge = function (target) {
  for (var i = 1, j = arguments.length; i < j; i++) {
    var source = arguments[i]
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        var value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }
  return target
}

module.exports = {
  checkPhone: checkPhone,
  offset: offset,
  transitionEnd: transitionEnd,
  merge: merge
}
