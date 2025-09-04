<template>
  <div class="navbar-container">
    <!-- Right-Aligned Icons -->
    <div class="d-flex align-items-center gap-4 ms-auto">
      <router-link to="/bar" class="text-decoration-none">
        <i class="bi bi-bar-chart fs-4 cursor-pointer theme-icon"></i>
      </router-link>
      <!-- Dark Mode Toggle Icon -->
      <i class="bi" :class="[isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill', 'theme-icon', iconAnimating ? 'animate-icon' : '']" @click="handleDarkModeClick" style="font-size: 1.4rem; cursor: pointer;"></i>
    </div>
  </div>
</template>








<script>
export default {
  name: "NavBar",
  data() {
    return {
      searchQuery: "",
      isDarkMode: false,
      iconAnimating: false,
      items: ["Apple", "Banana", "Orange", "Pineapple", "Strawberry", "Grapes", "Mango"], // Example items
      filteredItems: [], // Items that match the search query
    };
  },
  mounted() {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode === "true") {
      this.isDarkMode = true;
      document.body.classList.add("dark-mode");
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        // Perform the actual search logic here (e.g., filtering data, API call)
        console.log(`Searching for: ${this.searchQuery}`);
        // You can replace this with actual search functionality
      }
    },
    handleDarkModeClick() {
      this.iconAnimating = true;
      this.toggleDarkMode();
      setTimeout(() => {
        this.iconAnimating = false;
      }, 600); // Duration matches the CSS animation
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      document.body.classList.toggle("dark-mode", this.isDarkMode);
      localStorage.setItem("darkMode", this.isDarkMode);
    },
    filterItems() {
      // Filter items based on search query
      if (this.searchQuery) {
        this.filteredItems = this.items.filter(item =>
          item.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.filteredItems = [];
      }
    },
    selectItem(item) {
      this.searchQuery = item; // Populate search bar with the selected item
      this.filteredItems = [];  // Clear dropdown list after selection
    },
  },
};
</script>

<style scoped>
.navbar-container {
  position: fixed;
  top: 0;
  left: 250px; /* offset for sidebar */
  right: 0;
  height: 72px;
  z-index: 1050;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
}


.search-bar-wrapper {
  margin-left: auto;
  margin-right: 2rem;
  width: 400px;
}


.cursor-pointer {
  cursor: pointer;
}


.container-fluid {
  position: relative;
  width: 100%;
}


input {
  background-color: transparent;
  color: black;
}


button {
  background-color: #007bff;
}


.search-bar-wrapper {
  margin-left: auto;
  margin-right: 2rem;
  width: 400px; /* width of the search input */
  position: relative; /* Required to position the dropdown relative to the search bar */
}


.dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1060; /* Ensure it appears above other content */
  border-radius: 5px;
  width: 90%; /* Match the width of the search input */
  box-sizing: border-box; /* Ensures padding and borders are included in the width */
}


.dropdown-list li {
  padding: 10px;
  cursor: pointer;
}


.dropdown-list li:hover {
  background-color: #f0f0f0;
  color: #007bff; /* Add hover color for clarity */
}


.dropdown-list li.selected {
  background-color: #007bff;
  color: white;
}


</style>


<style>
/* global Dark Mode Styles */
body.dark-mode {
  background-color: #202020;
  color: #f1f1f1;
}


body.dark-mode .navbar-container {
  background-color: #202020;
  border-bottom: 1px solid #333;
}


/* Inputs */
body.dark-mode input.form-control {
  background-color: #2a2a2a;
  color: #ffffff;
  border: 1px solid #444;
}


body.dark-mode input::placeholder {
  color: #aaaaaa;
}


/* buttons */
body.dark-mode button {
  background-color: #0d6efd;
  color: white;
  border: none;
}


/* icons */
body.dark-mode i {
  color: #f1f1f1;
}


body.dark-mode .dropdown-list {
  background-color: #333;
  border: 1px solid #444;
}


body.dark-mode .dropdown-list li {
  color: #f1f1f1;
}


body.dark-mode .dropdown-list li:hover {
  background-color: #555;
  color: #007bff;
}


/* ensures all text elements bright in dark mode */
body.dark-mode,
body.dark-mode h1,
body.dark-mode h2,
body.dark-mode h3,
body.dark-mode h4,
body.dark-mode h5,
body.dark-mode h6,
body.dark-mode p,
body.dark-mode span,
body.dark-mode label,
body.dark-mode div,
body.dark-mode li,
body.dark-mode a,
body.dark-mode small,
body.dark-mode .form-label,
body.dark-mode .form-text {
  color: #f1f1f1 !important;
}


/* hover in dark mode */
body.dark-mode a:hover {
  color: #a8c0ff;
}


/* icon Animation */
.theme-icon {
  transition: transform 0.3s ease;
}


.theme-icon:hover {
  transform: scale(1.1);
}


.animate-icon {
  animation: rotate-icon 0.6s ease-in-out;
}


@keyframes rotate-icon {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}


/* dark mode transitions*/
body {
  transition: background-color 0.5s ease, color 0.5s ease;
}


.navbar-container, input.form-control, button, i, div, span, label,
p {
  transition: background-color 0.5s ease, color 0.5s ease;
}

</style>


