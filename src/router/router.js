import Vue from 'vue'
import Router from 'vue-router'

function route (path, file, name, children, requireAuth, redirect) {
  return {
    exact: true,
    path,
    name,
    children,
    redirect: redirect,
    component: require(`../pages/${file}.vue`),
    meta: {
      requireAuth: requireAuth
    }
  }
}

Vue.use(Router)

const router = new Router({
  base: __dirname,
  mode: 'hash',
  scrollBehavior: () => ({y: 0}),
  routes: [
    route('/login', 'Login', 'login', null, false),
    route('*', 'Error', 'error', null, false),
    route('/', 'Main', null, [
      route('/unfinishedTasks', 'UnfinishedTasks', 'unfinishedTasks', null, true),
      route('/supervisor', 'Supervisor', 'supervisor', null, true),
      route('/allTasks', 'AllTasks', 'allTasks', null, true)], true, '/unfinishedTasks')
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (localStorage.getItem('userName') !== 'undefined') {
      global.store.dispatch('checkPageTitle', to.path)
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export default router
