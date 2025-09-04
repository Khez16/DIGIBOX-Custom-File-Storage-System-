<template>
  <div :class="['sidebar', { 'show': showSidebar }]">
    <!-- Title & Logo  -->
    <div class="d-flex align-items-center mb-4">
      <img src="/src/assets/icon.png" alt="Logo" class="sidebar-logo me-2" />
      <h4 class="fw-bold mb-0">DigiBox</h4>
    </div>


    <!-- Navigation Items -->
    <ul class="nav flex-column">
      <li class="nav-item" v-for="item in navItems" :key="item.page">
        <router-link
          class="nav-link text-white d-flex align-items-center"
          :to="item.to"
          @click="navigateToPage(item.page)"
          :class="{ shake: disabled === item.page }"
        >
          <i :class="item.icon" class="me-2 fs-5"></i> {{ item.label }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Sidebar',
  props: ['showSidebar'],
  data() {
    return {
      disabled: null,
      navItems: [
        { label: 'Home', to: '/home', page: 'home', icon: 'bi bi-folder' },
        { label: 'Trash', to: '/trash', page: 'trash', icon: 'bi bi-trash' },
        { label: 'About Us', to: '/about', page: 'about', icon: 'bi bi-award' },
        { label: 'Log Out', to: '/login', page: 'login', icon: 'bi bi-box-arrow-right'}
      ]
    };
  },
  methods: {
    navigateToPage(page) {
      if (page === 'login'){
        this.logout();
        return;
      }
      else if (this.$route.path === `/${page}`) {
        this.disabled = page;
        setTimeout(() => {
          this.disabled = null;
        }, 1500);
      }
    },
    //logout command
    async logout() {
      try {
        const response = await axios.post('http://localhost:3000/logout');
        console.log('Logout successful:', response.data);
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
  }

};
</script>

<style scoped>
.sidebar {
  background-color: #0d6efd;
  color: white;
  position: fixed;
  top: 0;
  left: -250px;
  height: 100vh;
  width: 250px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  transition: left 0.3s ease;
  z-index: 1050;
}

.sidebar.show {
  left: 0;
}
.sidebar-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.nav-item {
  margin-bottom: 1rem;
}

.nav-link {
  font-size: 16px;
  padding: 10px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.nav-link:hover,
.nav-link.shake {
  background-color: rgba(255, 255, 255, 0.15);
  text-decoration: none;
}

/* Shake animation */
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
