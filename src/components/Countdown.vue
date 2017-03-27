<template>
  <div class="countdown" v-show="isShow"><span class="count">{{timer}}</span></div>
</template>

<script>
export default {
  name: 'countdown',
  props: {
    systemTime: {
      type: String,
      coerce: str => Math.trunc(Date.parse(str))
    },
    startTime: {
      type: String,
      coerce: str => Math.trunc(Date.parse(str))
    },
    endTime: {
      type: String,
      coerce: str => Math.trunc(Date.parse(str))
    }
  },
  data () {
    return {
      isShow: true,
      start: '',
      end: '',
      current: '',
      day: '',
      hour: '',
      minute: '',
      second: '',
      timer: ''
    }
  },
  mounted () {
    const self = this
    self.start = self.startTime.length === 10 ? self.startTime : Math.trunc(Date.parse(self.startTime) / 1000)
    self.end = self.endTime.length === 10 ? self.endTime : Math.trunc(Date.parse(self.endTime) / 1000)
    // 没返回服务器时间则取当前本地时间
    if (self.systemTime) {
      self.current = self.systemTime.length === 10 ? self.systemTime : Math.trunc(Date.parse(self.systemTime) / 1000)
    } else {
      self.current = new Date().getTime()
    }
    if (self.end > self.current && self.start < self.current || self.start === self.current) {
      self.runTime(self.end, self.start)
    } else {
      self.timer = '已结束'
      self.comm()
    }
  },
  methods: {
    runTime (end, start) {
      const self = this
      let distance = end - start
      if (distance > 0) {
        let day = self.day
        let hour = self.hour
        let minute = self.minute
        let second = self.second
        day = Math.floor(distance / (60 * 60 * 24))
        hour = Math.floor((distance - day * 24 * 60 * 60) / 3600)
        minute = Math.floor((distance - day * 24 * 60 * 60 - hour * 3600) / 60)
        second = Math.floor(distance - day * 24 * 60 * 60 - hour * 3600 - minute * 60)
        hour = hour < 10 ? '0' + hour : hour
        minute = minute < 10 ? '0' + minute : minute
        second = second < 10 ? '0' + second : second
        if (day > 0) {
          self.timer = day + '天'
        } else {
          self.timer = hour + ':' + minute + ':' + second
        }
        setTimeout(() => {
          self.runTime(self.end, self.start += 1000)
        }, 1000)
      } else {
        self.comm()
      }
    },
    comm () {
      this.$emit('done')
    }
  }
}
</script>
