import Vue from 'vue'
import Router from 'vue-router'

function route (path, file, name, children, redirect) {
  return {
    exact: true,
    path,
    name,
    children,
    redirect: redirect,
    component: require(`../pages/${file}.vue`)
  }
}

Vue.use(Router)

const router = new Router({
  base: __dirname,
  mode: 'hash',
  scrollBehavior: () => ({y: 0}),
  routes: [
    route('/login', 'Login', 'login'),
    route('*', 'Error', 'error'),
    route('/', 'Main', null, [
      route('/unfinishedTasks', 'UnfinishedTasks', 'unfinishedTasks'),
      route('/supervisor', 'Supervisor', 'supervisor'),
      route('/allTasks', 'AllTasks', 'allTasks')
    ], '/unfinishedTasks')
  ]
})

router.beforeEach((to, from, next) => {
  /*
  if (!localStorage.getItem('userName')) {
    global.store.dispatch('checkPageTitle', to.path)
    next()
  } else {
    this.$router.push({
      path: '/login'
    })
  }
  */
  global.store.dispatch('checkPageTitle', to.path)
  next()
})

export default router
