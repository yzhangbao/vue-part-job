import Vue from 'vue'
export default {
  install () {
    let timer = null
    Vue.prototype.tooltips = (msg) => {
      const ele = document.getElementById('msgTip')
      ele && ele.parentNode.removeChild(ele)
      const div = document.createElement('div')
      document.body.appendChild(div)
      div.id = 'msgTip'
      div.className = 'tips animated zoomIn'
      const span = document.createElement('span')
      div.appendChild(span)
      span.className = 'txt'
      span.innerText = msg
      clearTimeout(timer)
      const el = document.getElementById('msgTip')
      const handler = () => {
        el.parentNode.removeChild(el)
      }
      timer = setTimeout(() => {
        div.className = 'tips animated zoomOut'
        el.addEventListener('animationend', handler)
        el.addEventListener('webkitAnimationEnd', handler)
      }, 2500)
    }
  }
}
