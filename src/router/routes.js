const routes = [
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      }
    ],
    meta: { requiresAuth: true }
  },

  {
    path: '/free',
    component: () => import('src/layouts/FreeLayout.vue'),
    children: [
      {
        path: 'consulta-publica',
        component: () => import('pages/ConsultaPublicaPage.vue')
      },
      {
        path: 'consulta-publica/list',
        component: () => import('pages/GadoListPage.vue')
      },
      {
        path: 'consulta-publica/:id',
        name: 'gadoInfo',
        component: () => import('pages/GadoInfoPage.vue')
      }
    ],
    meta: { requiresAuth: false }
  },

  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    redirect: () => { return { path: '/app' } }
  }
]

export default routes
