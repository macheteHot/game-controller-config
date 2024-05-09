import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'config',
      meta: {
        title: '手柄皮肤配置器'
      },
      component: () => import('@/views/GamepadViewerConfig.vue')
    },
    {
      path: '/obs',
      name: 'obs',
      meta: {
        title: 'obs 手柄预览'
      },
      component: () => import('@/views/GamepadObs.vue')
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach(async (to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router
