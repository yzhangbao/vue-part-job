<template>
	<div>
        <div class="swiper-banner">
	        <swiper :options="swiperOption" ref="mySwiper">
  			    <swiper-slide v-for="(slide, index) in swiperSlides" :slide="slide" :index="index" :key="slide.id">
  					  <a :href="slide.link">
                  <img class="swiper-lazy" v-if="index == 0" :src="slide.img">
                  <img class="swiper-lazy" v-else :data-src="slide.img">
                  <div class="swiper-lazy-preloader"></div>
              </a>
  			    </swiper-slide>
  			    <div class="swiper-pagination" slot="pagination"></div>
  			 </swiper>
        </div>
        <!-- 问候语 begin -->
        <div class="greeting border-handle">
        	<template v-if="greeting == 0">
            <p class="cn"><i class="icon-greeting"></i>上午好</p>
            <p>Good morning</p>
        	</template>
        	<template v-else-if="greeting == 1">
            <p class="cn"><i class="icon-greeting afternoon"></i>下午好</p>
            <p>Good afternoon</p>
          </template>
          <template v-else>
            <p class="cn"><i class="icon-greeting evening"></i>晚上好</p>
            <p>Good evening</p>
          </template>
        </div>
        <!-- 问候语 end -->
        <ul class="tasks-list" id="tasksList">
            <li class="item" v-for="row of taskList">
              <!-- <router-link class="item-link" :to="'/detail/' + row.id" :style="'background-image: url(' + row.img + ')'"> -->
            	<router-link class="item-link" :to="'/detail/' + row.id">
                    <!-- <img :src="row.img" alt=""> -->
                    <asyn-image :src="row.img"></asyn-image>
                    <div class="info">
                        <div class="labels"><label>{{row.tag}}</label></div>
                        <div class="title">{{row.title}}</div>
                        <div class="intro">
                            剩余任务<span class="num">{{row.remaining}}</span>
                            <span class="dot">·</span>
                            任务奖励<span class="num">{{row.reward}}元</span>
                        </div>
                    </div>
                    <div class="bg"></div>
                </router-link>
            </li>
            <li class="loading" :class="{loaded: loaded}">{{loadingTip}}</li>
        </ul>
	</div>
</template>

<script>
// 未开发功能：1.上拉刷新；
  import axios from 'axios'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import asynImage from '../components/AsynImage'
  export default {
    name: 'home',
    data () {
      return {
        swiperOption: {
          notNextTick: true,
          autoplay: 3500,
          setWrapperSize: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          lazyLoading: true,
          lazyLoadingOnTransitionStart: true
        },
        swiperSlides: [],
        taskList: [],
        greeting: null,
        scroll: true,
        loaded: false,
        loadingTip: '玩命加载中...',
        params: {
          page: 2,
          query: 'index'
        }
      }
    },
    created () {
      const self = this
      axios.all([self.getBanner(), axios.get('/home/taskList')])
        .then(axios.spread(function (res1, res2) {
          self.swiperSlides = res1.data.body.list
          self.taskList = res2.data.body.list
        }))
      self.hello()
      window.addEventListener('scroll', self.getTaskList, false)
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    beforeRouteLeave (to, from, next) {
      const self = this
      window.removeEventListener('scroll', self.getTaskList, false)
      next()
    },
    methods: {
      getBanner () {
        return axios.get('/home/banner')
      },
      getTaskList () {
        const self = this
        let totalheight = parseInt(window.screen.height) + parseInt(document.body.scrollTop)
        if (self.scroll && self.params.page < 10 && document.body.scrollHeight <= totalheight + 160) {
          self.scroll = false
          axios.post('/home/taskList', self.params)
            .then(res => {
              self.taskList.push.apply(self.taskList, res.data.body.list)
              self.scroll = true
              self.params.page += 1
              if (self.params.page >= 10) {
                self.loadingTip = '侬家也是有底线的~'
                self.loaded = true
              }
            })
        }
      },
      hello () {
        const self = this
        let now = new Date()
        let hour = now.getHours()
        if (hour < 12) {
          self.greeting = 0
        } else if (hour < 19) {
          self.greeting = 1
        } else {
          self.greeting = 2
        }
      }
    },
    components: {
      swiper,
      swiperSlide,
      asynImage
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/scss/basic";
  .tasks-list{
    .item{
      >a{
        display: block;
        height: 100%;
        background-size: cover;
        background-position: 50%;
        background-repeat: no-repeat;
        background-color: rgba(0,0,0,.1);
        overflow: hidden;
      }
    }
  }
  .loading{
    position: relative;
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
