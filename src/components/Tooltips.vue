<template>
  <div class="tips animated" :class="styleObj" v-show="isShow"><span class="txt">{{tip}}</span></div>
</template>

<script>
export default {
  name: 'tooltips',
  props: {
    tip: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      isShow: false,
      styleObj: {
        zoomIn: true,
        zoomOut: false
      }
    }
  },
  watch: {
    tip: function (val, old) {
      var self = this
      if (self.timeout) clearTimeout(self.timeout)
      if (val !== '' && !!self.duration) {
        self.isShow = true
        self.styleObj.zoomIn = self.isShow
        self.styleObj.zoomOut = !self.isShow
        self.timeout = setTimeout(() => {
          self.styleObj.zoomIn = !self.isShow
          self.styleObj.zoomOut = self.isShow
          self.comm()
        }, self.duration)
      }
    }
  },
  methods: {
    comm () {
      this.$emit('clear')
    }
  }
}
</script>
