import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

Vue.use(Router)

const Index = resolve => {
  require.ensure(['@/views/Index'], () => {
    resolve(require('@/views/Index'))
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'Index',  //有默认子路由，则去掉
      component: Index,
      children: [
        {
          path: '',
          component (resolve) {
            require.ensure(['@/views/Home'], () => {
              resolve(require('@/views/Home'))
            })
          }
        },
        {
          path: 'task',
          component (resolve) {
            require.ensure(['@/views/Task'], () => {
              resolve(require('@/views/Task'))
            })
          },
          meta: { requiresAuth: true }
        },
        {
          path: 'my',
          component (resolve) {
            require.ensure(['@/views/My'], () => {
              resolve(require('@/views/My'))
            })
          },
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component (resolve) {
        require.ensure(['@/views/Detail'], () => {
          resolve(require('@/views/Detail'))
        })
      }
    },
    {
      path: '/login',
      name: 'Login',
      component (resolve) {
        require.ensure(['@/views/Login'], () => {
          resolve(require('@/views/Login'))
        })
      }
    },
    {
      path: '*',
      name: 'Error',
      component (resolve) {
        require.ensure(['@/views/Error'], () => {
          resolve(require('@/views/Error'))
        })
      }
    }
  ],
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    // 只在 HTML5 history 模式下可用
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
