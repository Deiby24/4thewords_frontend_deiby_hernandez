import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/leyendas',
      name: 'Leyendas',
      component: () => import('@/views/LeyendasView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/leyendas/crear',
      name: 'CreateLeyenda',
      component: () => import('@/views/CreateLeyendaView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/leyendas/editar/:id',
      name: 'EditLeyenda',
      component: () => import('@/views/EditLeyendaView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/leyendas')
  } else {
    next()
  }
})

export default router
