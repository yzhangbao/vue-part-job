<template>
	<div>
        <div class="swiper-banner">
	        <swiper :options="swiperOption" ref="mySwiper">
  			    <swiper-slide v-for="(slide, index) in swiperSlides">
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
            	<router-link class="item-link" :to="'/detail/' + row.id">
                    <img :src="row.img" alt="">
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
        </ul>
	</div>
</template>

<script>
// 未开发功能：1.上拉刷新；2.下拉加载更多；3.图片懒加载
  import axios from 'axios'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
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
        greeting: null
      }
    },
    created () {
      const self = this
      axios.all([self.getBanner(), self.getTaskList()])
      .then(axios.spread(function (res1, res2) {
        self.swiperSlides = res1.data.body.list
        self.taskList = res2.data.body.list
      }))
      self.hello()
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    methods: {
      getBanner () {
        return axios.get('/home/banner')
      },
      getTaskList () {
        return axios.get('/home/taskList')
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
      swiperSlide
    }
  }
</script>
