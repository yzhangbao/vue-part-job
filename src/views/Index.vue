<template>
	<section class="wrap">
        <router-view></router-view>
        <!--底部TAB菜单-->
        <div class="tab-bar">
            <router-link class="item" to="/" exact active-class="current">
                <touch-ripple :centerRipple="false" color="#f55c50">
                    <i class="icon-bar"><i class="icon-bar icon0"></i></i><p>首页</p>
                </touch-ripple>
            </router-link>
            <router-link class="item new" to="/task" active-class="current">
                <touch-ripple :centerRipple="false" color="#f55c50">
                    <i class="icon-bar"><i class="icon-bar icon1"></i></i><p>任务</p>
                </touch-ripple>
            </router-link>
            <router-link class="item" to="/my" active-class="current">
                <touch-ripple :centerRipple="false" color="#f55c50">
                    <i class="icon-bar"><i class="icon-bar icon2"></i></i><p>我</p>
                </touch-ripple>
            </router-link>
        </div>
    </section>
</template>

<script>
  import touchRipple from '../components/TouchRipple'
  export default {
    name: 'index',
    components: {
      touchRipple
    }
  }
</script>
