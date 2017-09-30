import Vue from 'vue'
import Router from 'vue-router'

function route (path, file, name, children, requireAuth, redirect) {
  return {
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
  routes: [
    route('/login', 'Login', 'login', null, false),
    route('*', 'Error', 'error', null, false),
    route('/', 'Main', null, [
      route('/add', 'AddTask', 'addTask', null, true),
      route('/unfinishedTasks', 'UnfinishedTasks', 'unfinishedTasks', null, true),
      route('/unfinishedTasks/:id', 'UnfinishedTasksDetails', 'unfinishedTasksDetails', null, true),
      route('/supervisor', 'Supervisor', 'supervisor', null, true),
      route('/supervisor/:id', 'SupervisorDetails', 'supervisorDetails', null, true),
      route('/supervisor/:id/edit', 'EditTask', 'editTask', null, true),
      route('/allTasks', 'AllTasks', 'allTasks', null, true),
      route('/allTasks/:id', 'AllTasksDetails', 'AllTasksDetails', null, true)], true, '/unfinishedTasks')
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.meta.requireAuth) {
    if (!localStorage.getItem('userName')) {
      next({
        path: '/login'
      })
    } else {
      global.store.dispatch('checkPageTitle', to.path)
      next()
    }
  } else {
    if (localStorage.getItem('userName')) {
      next({
        path: from.path
      })
    } else {
      next()
    }
  }
})

export default router
