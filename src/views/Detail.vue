<template>
	<section class="wrap">
		<div class="tasks-list detail-cover">
	        <div class="item">
	            <img :src="result.img" alt="">
	            <div class="info">
	                <div class="labels"><label>{{result.tag}}</label></div>
	                <div class="title">{{result.title}}</div>
	            </div>
	            <div class="bg"></div>
	        </div>
	        <div class="detail-info">
	            <ul class="items">
	                <li><label>剩余任务</label>{{result.remaining}}</li>
	                <li><label>报名截止</label>{{result.date}}</li>
	                <li><label>审核时长</label>{{result.duration}}</li>
	            </ul>
	            <div class="reward">任务奖励<span class="num">{{result.reward}}</span>元</div>
	        </div>
	    </div>
	    <!-- 任务介绍 begin -->
	    <div class="detail-task">
	        <div class="title"><span class="name">任务介绍</span></div>
	        <div class="detail-content" v-html="result.content"></div>
	    </div>
	    <!-- 任务介绍 end -->
	    <div class="section-btn-box">
			<router-link class="btn confirm" v-if="result.status == 1" to="/do">接任务</router-link>
	        <div class="btn confirm disabled" v-else-if="result.status == 2">任务已抢光，下次早点来哦</div>
	        <div class="btn confirm complete" v-else>任务已完成，验收通过！棒棒哒</div>
	    </div>
	</section>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'detail',
    data () {
      return {
        result: {}
      }
    },
    created () {
      const self = this
      self.getDetail()
    },
    methods: {
      getDetail () {
        const self = this
        axios.post('/task/detail', {id: self.$route.params.id})
        .then(res => {
          self.result = res.data.body.detail
        }, error => {
          console.error(error)
        })
      }
    }
  }
</script>
