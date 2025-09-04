import { createRouter, createWebHistory } from 'vue-router'
import login from '../view/login.vue'
import Body from '../view/Body.vue'
import signup from '../view/signup.vue'
import about from '../view/about.vue'
import Trash from '../view/TrashBody.vue'
import forgotPassword from '../view/forgotPassword.vue'
import bar from '../view/D3.vue'


// ADD PATHS, ADJUST SIDEBAR.VUE TO MATCH & REDIRECT LINKS
const routes = [
  {
    path: '/home',
    name: 'Body',
    component: Body 
  },
  {
    path: '/signup',
    name: 'signup',
    component: signup
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/about',
    name: 'about',
    component: about
  },
  {
    path: '/trash',
    name: 'Trash',
    component: Trash
  },
  {
    path: '/forgotPassword',
    name: 'forgotPassword',
    component: forgotPassword
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/bar',
    name: 'bar',
    component: bar
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router