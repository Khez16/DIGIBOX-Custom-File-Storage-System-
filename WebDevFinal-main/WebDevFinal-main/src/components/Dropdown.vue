<template>
    <div class="dropdown">
      <i class="bi bi-three-dots-vertical cursor-pointer"  @click="toggleDropdown"></i>
      <!-- Dropdown Menu -->
      <div class="dropdown-menu dropdown-menu-end shadow-sm" :class="{ 'show': isOpen }" style="min-width: 120px;">
        <button class="dropdown-item d-flex align-items-center gap-2" @click="$emit('rename', fileIndex)">
          <i class="bi bi-pencil-square text-primary"></i> Rename
        </button>
        <button class="dropdown-item d-flex align-items-center gap-2" @click="$emit('download', fileIndex)">
          <i class="bi bi-arrow-down-circle text-primary"></i> Download
        </button>
        <button class="dropdown-item d-flex align-items-center gap-2" @click="$emit('delete', fileIndex)">
          <i class="bi bi-trash text-danger"></i> Delete
        </button>    
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Dropdown',
    props: {
      fileIndex: {
        type: Number,
        required: true
      },
      isOpen: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toggleDropdown() {
        this.$emit('toggle', this.fileIndex);
      },
      rename(){
        // First, we can add another prop to display a text box
        // to rename the file.

      }
    }
  }
  </script>
  
  <style scoped>
  /* Dropdown styling */
  .dropdown {
    position: relative;
  }
  
  .dropdown-menu {
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 1000;
    display: none;
    padding: 0.5rem 0;
    margin: 0.125rem 0 0;
    font-size: 0.875rem;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
  }
  
  .dropdown-menu.show {
    display: block;
  }
  
  .dropdown-item {
    display: block;
    width: 100%;
    padding: 0.4rem 1rem;
    clear: both;
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
    cursor: pointer;
  }
  
  .dropdown-item:hover, .dropdown-item:focus {
    color: #16181b;
    text-decoration: none;
    background-color: #f8f9fa;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  /* Dark mode adjustments for dropdown */
  body.dark-mode .dropdown-menu {
    background-color: #343a40;
    border-color: rgba(255, 255, 255, 0.15);
  }
  
  body.dark-mode .dropdown-item {
    color: #f8f9fa;
  }

  body.dark-mode .dropdown-item:hover, 
  body.dark-mode .dropdown-item:focus {
    background-color: #444444;
  }
  </style>