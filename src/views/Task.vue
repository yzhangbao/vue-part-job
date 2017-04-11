<template>
	<div>
		<div class="tab-box border-handle">
            <ul class="tab-items">
                <li :class="{current: activeIndex==0}" @click="switchTab(0, true)">待完成<span class="num">({{info.unTotal}})</span><touch-ripple :centerRipple="false"></touch-ripple></li>
                <li :class="{current: activeIndex==1}" @click="switchTab(1, true)">待验收<span class="num">({{info.doTotal}})</span><touch-ripple :centerRipple="false"></touch-ripple></li>
                <li :class="{current: activeIndex==2}" @click="switchTab(2, true)">已结束<touch-ripple :centerRipple="false"></touch-ripple></li>
            </ul>
        </div>
        <div id="tabs-container">
            <swiper class="tab-content" :options="swiperOption" ref="mySwiper">
                <!-- 待完成[[ -->
                <swiper-slide class="task-list">
                    <div v-show="list[0]">
                        <ul class="list" v-if="list[0]">
                            <li class="item" v-for="(row, index) of list[0]">
                            	<router-link class="detail-view" :to="'/detail/' + row.id">{{row.title}}<span class="tag border-handle" v-if="row.tag">{{row.tag}}</span><touch-ripple :centerRipple="false"></touch-ripple></router-link>
                                <div class="item-info">
                                    <div class="date-time">
                                        <p class="tit">距离完成还剩</p>
                                        <countdown :systemTime="row.systemTime" :startTime="row.startTime" :endTime="row.endTime" v-on:done="doneEvt(0, index)"></countdown>
                                    </div>
                                    <router-link class="perform border-handle" v-if="row.status ==0" :to="'/done/' + row.taskId">{{row.tag ? '去执行' : '做任务'}}<touch-ripple :centerRipple="false"></touch-ripple></router-link>
                                    <div class="perform border-handle disabled" v-if="row.status ==1">{{row.tag ? '去执行' : '做任务'}}</div>
                                </div>
                            </li>
                        </ul>
                        <dl class="data-empty" v-else>
                            <dt class="icon"></dt>
                            <dd class="tip">还没有待完成的任务</dd>
                        </dl>
                        <div class="loading" :class="{loaded: loaded[0]}">{{loadingTip[0]}}</div>
                    </div>
                </swiper-slide>
                <!-- 待验收[[ -->
                <swiper-slide class="task-list">
                    <div v-show="list[1]">
                        <ul class="list" v-if="list[1]">
                            <li class="item" v-for="row of list[1]">
                                <router-link class="detail-view" :to="'/detail/' + row.id">{{row.title}}<span class="tag border-handle" v-if="row.tag">{{row.tag}}</span><touch-ripple :centerRipple="false"></touch-ripple></router-link>
                                <div class="item-info">
                                    <div class="date-time">
                                        <p class="tit">距离完成还剩</p>
                                        <countdown :systemTime="row.systemTime" :startTime="row.startTime" :endTime="row.endTime"></countdown>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <dl class="data-empty" v-else>
                            <dt class="icon"></dt>
                            <dd class="tip">还没有待验收的任务</dd>
                        </dl>
                        <div class="loading" :class="{loaded: loaded[1]}">{{loadingTip[1]}}</div>
                    </div>
                </swiper-slide>
                <!-- 已结束[[ -->
                <swiper-slide class="task-list">
                    <div v-show="list[2]">
                        <ul class="list" v-if="list[2]">
                            <li class="item" v-for="(row, index) of list[2]">
                                <router-link class="detail-view" :to="'/detail/' + row.id">{{row.title}}<span class="tag border-handle" v-if="row.tag">{{row.tag}}</span><touch-ripple :centerRipple="false"></touch-ripple></router-link>
                                <dl class="item-info">
                                    <dt class="acceptance"><i class="icon-acceptance" :class="{icon01: row.status==3}"></i>{{row.status==3 ? '验收未通过' : '验收通过'}}</dt>
                                    <dd class="acceptance-tip" v-if="row.status==3 && row.reason">未通过原因：{{row.reason}}</dd>
                                </dl>
                            </li>
                        </ul>
                        <dl class="data-empty" v-else>
                            <dt class="icon"></dt>
                            <dd class="tip">还没有已结束的任务</dd>
                        </dl>
                        <div class="loading" :class="{loaded: loaded[2]}">{{loadingTip[2]}}</div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
	</div>
</template>

<script>
// 模拟数据，有可能倒计时与按钮状态有不一致情况
// 未完善功能：1.上拉刷新；
  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import Countdown from '../components/Countdown'
  import touchRipple from '../components/TouchRipple'
  export default {
    name: 'task',
    data () {
      return {
        swiperOption: {
          notNextTick: true,
          setWrapperSize: true,
          autoHeight: true
        },
        activeIndex: 0,
        info: {},
        list: [],
        scroll: true,
        page: [1, 1, 1],
        loaded: [false, false, false],
        loadingTip: ['玩命加载中...', '玩命加载中...', '玩命加载中...']
      }
    },
    created () {
      const self = this
      self.getList()
      window.addEventListener('scroll', self.getScrollList, false)
    },
    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo'
      }),
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    beforeRouteLeave (to, from, next) {
      const self = this
      window.removeEventListener('scroll', self.getScrollList, false)
      next()
    },
    mounted () {
      const self = this
      self.swiper
        .on('transitionEnd', swiper => {
          self.switchTab(swiper.activeIndex, false)
        })
    },
    methods: {
      getList () {
        const self = this
        let type = self.activeIndex
        axios.post('/task/taskList', {userId: self.userInfo.userId, type: type, page: self.page[type]})
          .then(res => {
            let data = res.data.body
            self.info = data.info
            if (self.list[type]) {
              self.list[type].push.apply(self.list[type], data.list)
            } else {
              self.list[type] = data.list
            }
            self.page[type] += 1
            self.scroll = true
            if (self.page[type] >= 10) {
              self.loadingTip[type] = '侬家也是有底线的~'
              self.loaded[type] = true
            }
          }, error => {
            console.error(error)
          })
      },
      getScrollList () {
        const self = this
        let type = self.activeIndex
        let totalheight = parseInt(window.screen.height) + parseInt(document.body.scrollTop)
        if (self.scroll && self.page[type] < 10 && document.body.scrollHeight <= totalheight + 160) {
          self.scroll = false
          self.getList()
        }
      },
      switchTab (index, change) {
        const self = this
        self.activeIndex = index
        if (self.page[index] === 1) {
          window.scrollTo(0, 0)
          self.getList()
        }
        if (change) {
          self.swiper.slideTo(self.activeIndex)
        }
      },
      doneEvt (i, j) {
        // 0 待完成 1 已延迟 2 待验收 3 已结束拒绝 4 已结束通过
        // 倒计时结束，标记任务状态为延期
        this.list[i][j].status = 1
      }
    },
    components: {
      swiper,
      swiperSlide,
      Countdown,
      touchRipple
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/scss/basic";
  .loading{
    position: relative;
    @include remlace(padding-bottom, 10px);
    text-align: center;
    color: #999;
    &.loaded{
      &:before{
        display: none;
      }
    }
    &:before{
      display: inline-block;
      @include remlace(margin-right, 10px);
      content: '';
      @include remlace(width, 36px);
      @include remlace(height, 36px);
      vertical-align: middle;
      border-radius: 50%;
      border: pxToRem(4px) solid rgba(153, 153, 153, .3);
      border-bottom: pxToRem(4px) solid #999;
      animation: loading 1.4s infinite linear;
    }
  }
  @keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
