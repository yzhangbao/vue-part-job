<template>
  <transition name="ripple">
    <div class="circle-ripple" :style="styles"></div>
  </transition>
</template>

<script>
import util from '../libs/utils'
export default {
  props: {
    mergeStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    color: {
      type: String,
      default: ''
    },
    opacity: {
      type: Number
    }
  },
  computed: {
    styles () {
      return util.merge({}, {backgroundColor: this.color, opacity: this.opacity}, this.mergeStyle)
    }
  }
}
</script>

<style lang="scss" scoped>
  .circle-ripple{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    pointer-events: none;
    user-select: none;
    border-radius: 50%;
    background-color: #ccc;
    background-clip: padding-box;
    opacity: .35;
  }

  .ripple-enter-active, .ripple-leave-active{
    transition: opacity 2s cubic-bezier(0.23, 1, 0.32, 1), transform .85s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .ripple-enter {
    transform: scale(0);
  }

  .ripple-leave-active{
    opacity: 0 !important;
  }
</style>
