<template>
	<section class="wrap">
        <router-view></router-view>
        <!--底部TAB菜单-->
        <div class="tab-bar">
            <router-link class="item" to="/" exact active-class="current"><i class="icon-bar"><i class="icon-bar icon0"></i></i><p>首页</p></router-link>
            <router-link class="item new" to="/task/0" active-class="current"><i class="icon-bar"><i class="icon-bar icon1"></i></i><p>任务</p></router-link>
            <router-link class="item" to="/my" active-class="current"><i class="icon-bar"><i class="icon-bar icon2"></i></i><p>我</p></router-link>
        </div>
    </section>
</template>

<script>
  export default {
    name: 'index'
  }
</script>
