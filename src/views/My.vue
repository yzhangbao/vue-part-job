<template>
	<div class="ucenter-box">
        <div class="graphic">
            <div class="pic"><img src="../assets/logo.png" alt=""></div>
            <dl class="info">
                <dt class="name">{{userInfo.userName}}</dt>
                <dd class="phone"><i class="icon-ucenter phone"></i>{{phone}}</dd>
            </dl>
        </div>
        <div class="item-ucenter">
            <a href="javascript:;" class="item item-link">
                <p class="name"><i class="icon-ucenter icon0"></i>个人信息</p>
                <p class="tip">90%</p>
            </a>
            <a href="javascript:;" class="item item-link">
                <p class="name"><i class="icon-ucenter icon1"></i>身份认证</p>
                <p class="tip">未认证</p>
            </a>
            <a href="javascript:;" class="item item-link">
                <p class="name"><i class="icon-ucenter icon2"></i>我的钱包</p>
                <p class="tip">0.00</p>
            </a>
        </div>
        <div class="item-ucenter">
            <a href="javascript:;" class="item item-link">
                <p class="name"><i class="icon-ucenter icon3"></i>邀请好友</p>
                <p class="tip highlight">有奖励</p>
            </a>
            <a href="mailto:yangzhangbao@126.com" class="item item-link">
                <p class="name"><i class="icon-ucenter icon4"></i>意见反馈</p>
            </a>
        </div>
        <div class="item-ucenter">
            <a href="javascript:;" class="item item-link" @click="isLogout">
                <p class="name"><i class="icon-ucenter icon5"></i>安全退出</p>
            </a>
        </div>
        <div v-show="isDialog">
            <div class="pop-box animated" :class="{slideInDown: isDialog, slideOutUp: !isDialog}">
                <div class="content-tips">
                    <p>确定要退出吗？</p>
                </div>
                <div class="pop-btns-box">
                    <div class="button item-link confirm" @click="logout">确认</div>
                    <div class="button item-link close" @click="close">取消</div>
                </div>
            </div>
            <div class="mask animated" :class="{fadeIn: isDialog, fadeOut: !isDialog}"></div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'login',
    data () {
      return {
        isDialog: false
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo'
      }),
      phone () {
        const reg = /^(\d{3})\d{4}(\d{4})$/
        return this.userInfo.phone.toString().replace(reg, '$1****$2')
      }
    },
    methods: {
      isLogout () {
        this.isDialog = true
      },
      close () {
        this.isDialog = false
      },
      logout () {
        // 模拟退出
        // ajax...
        window.sessionStorage.removeItem('user')
        this.$store.dispatch('setUserInfo', {})
        this.$router.push({
          path: '/'
        })
      }
    }
  }
</script>
