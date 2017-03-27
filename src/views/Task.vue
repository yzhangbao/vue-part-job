<template>
	<div>
		<div class="tab-box border-handle">
            <ul class="tab-items">
                <li :class="{current: activeIndex==0}" @click="switchTab(0, true)">待完成<span class="num">({{info.unTotal}})</span></li>
                <li :class="{current: activeIndex==1}" @click="switchTab(1, true)">待验收<span class="num">({{info.doTotal}})</span></li>
                <li :class="{current: activeIndex==2}" @click="switchTab(2, true)">已结束</li>
            </ul>
        </div>
        <div id="tabs-container">
            <swiper class="tab-content" :options="swiperOption" ref="mySwiper">
                <!-- 待完成[[ -->
                <swiper-slide class="task-list">
                    <div v-show="list[0]">
                        <ul class="list" v-if="list[0]">
                            <li class="item" v-for="(row, index) of list[0]">
                            	<router-link class="detail-view item-link" :to="'/detail/' + row.id">{{row.title}}<span class="tag border-handle" v-if="row.tag">{{row.tag}}</span></router-link>
                                <div class="item-info">
                                    <div class="date-time">
                                        <p class="tit">距离完成还剩</p>
                                        <countdown :systemTime="row.systemTime" :startTime="row.startTime" :endTime="row.endTime" v-on:done="doneEvt(0, index)"></countdown>
                                    </div>
                                    <router-link class="perform border-handle item-link" v-if="row.status ==0" :to="'/done/' + row.taskId">{{row.tag ? '去执行' : '做任务'}}</router-link>
                                    <div class="perform border-handle disabled" v-if="row.status ==1">{{row.tag ? '去执行' : '做任务'}}</div>
                                </div>
                            </li>
                        </ul>
                        <dl class="data-empty" v-else>
                            <dt class="icon"></dt>
                            <dd class="tip">还没有待完成的任务</dd>
                        </dl>
                    </div>
                </swiper-slide>
                <!-- 待验收[[ -->
                <swiper-slide class="task-list">
                    <div v-show="list[1]">
                        <ul class="list" v-if="list[1]">
                            <li class="item" v-for="row of list[1]">
                                <router-link class="detail-view item-link" :to="'/detail/' + row.id">{{row.title}}<span class="tag border-handle" v-if="row.tag">{{row.tag}}</span></router-link>
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
                    </div>
                </swiper-slide>
                <!-- 已结束[[ -->
                <swiper-slide class="task-list">
                    <div v-show="list[2]">
                        <ul class="list" v-if="list[2]">
                            <li class="item" v-for="(row, index) of list[2]">
                                <router-link class="detail-view item-link" :to="'/detail/' + row.id">{{row.title}}<span class="tag border-handle" v-if="row.tag">{{row.tag}}</span></router-link>
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
                    </div>
                </swiper-slide>
            </swiper>
        </div>
	</div>
</template>

<script>
// 模拟数据，有可能倒计时与按钮状态有不一致情况
// 未完善功能：1.左右滚动盒子高度重置；2.上拉刷新；3.下拉加载更多
  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import Countdown from '../components/Countdown'
  export default {
    name: 'task',
    data () {
      return {
        swiperOption: {
          notNextTick: true,
          setWrapperSize: true,
          initialSlide: this.$route.params.type
        },
        activeIndex: 0,
        info: {},
        list: []
      }
    },
    created () {
      const self = this
      self.activeIndex = self.$route.params.type
      self.getList()
    },
    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo'
      }),
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    mounted () {
      const self = this
      self.swiper
        .on('slideChangeEnd', swiper => {
          self.switchTab(swiper.activeIndex, false)
        })
    },
    methods: {
      getList () {
        const self = this
        let type = self.activeIndex
        if (self.list[type] === undefined) {
          axios.post('/task/taskList', {userId: self.userInfo.userId, type: type})
            .then(res => {
              let data = res.data.body
              self.info = data.info
              self.list[type] = data.list
            }, error => {
              console.error(error)
            })
        }
      },
      switchTab (index, change) {
        const self = this
        window.scrollTo(0, 0)
        self.$router.push({
          path: '/task/' + index
        })
        self.activeIndex = self.$route.params.type
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
    watch: {
      '$route': 'getList'
    },
    components: {
      swiper,
      swiperSlide,
      Countdown
    }
  }
</script>
