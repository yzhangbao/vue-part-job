<template>
  <img :src="origin" width="100%" alt="">
</template>

<script>
// 思考：如何兼容背景图片懒加载？
export default {
  name: 'asynimage',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      origin: ''
    }
  },
  mounted () {
    const self = this
    this.$nextTick(() => {
      setTimeout(() => {
        self.loadImage()
        window.addEventListener('scroll', self.loadImage, false)
      })
    }, 400)
  },
  destroyed (to, from, next) {
    const self = this
    window.removeEventListener('scroll', self.loadImage, false)
  },
  methods: {
    getRect () {
      const offset = this.$el.getBoundingClientRect()
      return offset
    },
    loadImage () {
      const self = this
      const offset = self.getRect()
      if (offset.top < window.innerHeight && offset.bottom > 0 && offset.left < window.innerWidth && offset.right > 0) {
        const img = new Image()
        img.src = self.src
        img.onload = () => {
          self.origin = img.src
          self.$el.classList.add('fadeIn')
        }
      }
    }
  }
}
</script>

<style scoped>
  .fadeIn {
    animation: fadeIn 1s ease-out;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
