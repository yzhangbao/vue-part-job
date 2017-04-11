<template>
	<section class="wrap wrap-login" :style="'height: ' + availHeight + 'px'">
        <dl class="logo-box">
            <dt class="logo">能力共享</dt>
            <dd class="tip">每天进步一点</dd>
        </dl>
        <ul class="login-box">
            <li class="row border-handle">
                <input type="tel" class="txt" v-model="phone" maxlength="11" placeholder="手机号">
            </li>
            <li class="row border-handle">
                <input type="text" class="txt" v-model.number="code" maxlength="6" placeholder="验证码">
                <span class="get-code" @click="getCode">{{getText}}<touch-ripple :centerRipple="false" v-show="!disabled"></touch-ripple></span>
            </li>
            <li class="row">
                <div class="submit-btn" @click="login">登录<touch-ripple v-show="httping" :centerRipple="false" color="#f55c50"></touch-ripple></div>
            </li>
        </ul>
        <p class="login-tip">成功获取验证码后在console中查看</p>
    </section>
</template>

<script>
  import axios from 'axios'
  import utils from '../libs/utils'
  import touchRipple from '../components/TouchRipple'
  export default {
    name: 'login',
    data () {
      return {
        phone: '',
        code: null,
        getText: '获取验证码',
        timeout: 60,
        interval: 60,
        timer: null,
        disabled: false,
        httping: true,
        verify: null,
        availHeight: null
      }
    },
    created () {
      let doc = document
      let body = doc.body
      let clientTop = body.clientTop || 0
      let viewHeight = doc.documentElement.clientHeight || body.clientHeight
      this.availHeight = viewHeight - clientTop
    },
    methods: {
      getCode () {
        const self = this
        if (self.disabled) {
          return false
        }
        if (self.phone === '') {
          self.tooltips('请输入11位手机号码')
          return false
        } else if (!utils.checkPhone(self.phone)) {
          self.tooltips('手机号格式不正确')
          return false
        } else if (self.httping) {
          self.httping = false
          axios.post('/user/getCode', {phone: self.phone, code: self.code})
          .then(res => {
            self.httping = true
            self.countDown()
            self.verify = res.data.verify
            self.tooltips('请输入 ' + res.data.verify + ' 后登录', 5000)
            console.warn('请输入 ' + res.data.verify + ' 后登录')
          }, error => {
            console.error(error)
          })
        }
      },
      countDown () {
        const self = this
        if (self.interval > 1) {
          self.getText = --self.interval + 's'
          self.timer = setTimeout(() => {
            self.countDown()
          }, 1000)
          self.disabled = true
        } else {
          clearTimeout(self.timer)
          self.getText = '重新获取验证码'
          self.interval = self.timeout
          self.disabled = false
        }
      },
      login () {
        const self = this
        if (self.phone === '') {
          self.tooltips('请输入11位手机号码')
          return false
        } else if (!utils.checkPhone(self.phone)) {
          self.tooltips('手机号格式不正确')
          return false
        }
        if (self.code === '') {
          self.tooltips('请输入收到的验证码')
          return false
        } else if (self.code !== self.verify) {
          // 示例模拟验证，正式请重组
          self.tooltips('验证码错误')
          return false
        }
        axios.post('/user/login', {phone: self.phone, code: self.code})
        .then(res => {
          if (res.data.code === 200) {
            let data = res.data.info
            let user = {
              userId: data.id,
              userName: data.user,
              phone: data.phone
            }
            window.sessionStorage.user = JSON.stringify(user)
            self.$store.dispatch('setUserInfo', user)
            let redirect = decodeURIComponent(self.$route.query.redirect || '/')
            self.$router.push({
              path: redirect
            })
          } else {
            self.msg = res.data.msg
          }
        }, error => {
          console.error(error)
        })
      }
    },
    components: {
      touchRipple
    }
  }
</script>

<style lang="scss" scoped>
	@import "../assets/scss/style";
</style>
