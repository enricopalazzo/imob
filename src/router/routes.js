
import Urbanizaciones from 'pages/Urbanizaciones'
import Usuarios from 'pages/Usuarios'
import Sectores from 'pages/Sectores'
import Viviendas from 'pages/Viviendas'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '/urbanizaciones', // here it is, route /user/profile
        component: Urbanizaciones // we reference /src/pages/Profile.vue imported above
      },
      {
        path: '/usuarios', // here it is, route /user/profile
        component: Usuarios // we reference /src/pages/Profile.vue imported above
      },
      {
        path: '/sectores', // here it is, route /user/profile
        component: Sectores // we reference /src/pages/Profile.vue imported above
      },
      {
        path: '/viviendas', // here it is, route /user/profile
        component: Viviendas // we reference /src/pages/Profile.vue imported above
      },
      { path: '', component: () => import('pages/Index.vue') }
    ]
  }
  /* {
    path: '/urbanizaciones',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      // Urbanizaciones page
      {
        path: 'urbanizaciones', // here it is, route /user/profile
        component: Urbanizaciones // we reference /src/pages/Profile.vue imported above
      }
    ]
  } */
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
