<template>
  <div :class="['layout-wrapper', {
    'home-layout': $route.path === '/home',
    'trash-layout': $route.path === '/trash',
    'bar-layout': $route.path === '/bar'
  }]">
    <div class="d-flex">
      <Sidebar :showSidebar="showSidebar" />

      <div class="main-area flex-grow-1">
        <Navbar v-if="showNavbar" />
        <div class="p-4">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>





<script>
import Sidebar from './components/SideBar.vue';
import Navbar from './components/NavBar.vue';
import { computed } from 'vue'
import { useRoute } from 'vue-router'


export default {
  name: 'App',
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
      showSidebar: true,
      showNavbar: true
    };
  },
  watch: {
  $route(to) {
    // Hide sidebar on login, signup, and forgot password pages
    this.showSidebar = !(to.path === '/login' || to.path === '/signup' || to.path === '/forgotpassword');
    // Show navbar only on the home page and trash page and bar page
    this.showNavbar = (to.path === '/home' || to.path === '/trash' || to.path === '/bar');
  }
}

};
</script>
