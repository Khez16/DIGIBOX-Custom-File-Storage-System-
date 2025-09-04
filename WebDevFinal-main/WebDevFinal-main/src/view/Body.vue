<template>
  <div class="files-browser-container">
    <!-- Header -->
    <div class="header-container">
      <div class="title-container">
        <h1>📁 All Files</h1>
      </div>
      <NewButton />
    </div>

    <!-- Recent Files Section -->
    <h5 class="section-title">Recent Files</h5>
    <div class="recent-files-grid">
      <div v-for="(file, index) in recentFiles" :key="index" class="file-card-container">
        <div class="file-card">
          <i :class="getFileIcon(file.type)" class="file-icon"></i>
          <div class="file-name" :title="file.name">{{ file.name }}</div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container">
  <!-- Table Header -->
  <div class="table-header">
    <div class="header-name">Name</div>
    <div class="header-updated">Updated</div>
    <div class="header-size">Size</div>
  </div>

  <!-- Files List -->
  <div v-for="(file, index) in files" :key="index" class="table-row">  
    <div class="row-name">
      <i :class="getFileIcon(file.type)" class="row-icon"></i>
      <span class="row-text">{{ file.name }}</span>
    </div>
    <div class="row-updated">{{ file.date }}</div>
    <div class="row-size" style="display: flex; justify-content: space-between; align-items: center;">
      <div style="flex: 1; text-align: center;">{{ file.size }}</div>
      <Dropdown :fileIndex="index" :isOpen="dropdownIndex === index" @toggle="toggleDropdown" @delete="deleteFile"
      @download="downloadFile" @rename="renameFile" />
    </div>
  </div>
</div>
  </div>
</template>

<script>
import NewButton from '../components/NewButton.vue';
import Dropdown from '../components/Dropdown.vue';
import axios from 'axios';

export default {
  name: 'FilesBrowser',
  components: {
    NewButton,
    Dropdown
  },
  data() {
    return {
      user: null,
      recentFiles: [],
      files: [],
      dropdownIndex: null
    }
  },
  async created() {
    await this.loadStuff();
  },
  methods: {
    async loadStuff() {
      this.user = await this.getSession();
      this.user = JSON.stringify(this.user);
      this.recentFiles = await this.getRecentFiles();
      this.files = await this.getFiles();
    },

    async getSession() {
      try {
        // We have to get the email of the current user from the session.
        const response = await axios.get('http://localhost:3000/session');
        console.log('Session data:', response.data);
        return response.data
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    },

    //Code to get files
    async getFiles() {
      try {
        const response = await axios.get('http://localhost:3000/files', {
          params: {
            user: this.user,
            get_recent: '0',
            is_archived: '0'
          }
        });
        console.log('Files data:', response.data);

        const files = response.data.map(file => {
          return {
            name: file.filename,
            type: this.simplifyType(file.metadata.contentType),
            date: file.date,
            size: Math.round(file.size / 1024) + 'KB',
            download_url: file.url
          };
        });

        console.log('Files:', files);

        return files;
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    },

    async getRecentFiles() {
      try {
        const response = await axios.get('http://localhost:3000/files', {
          params: {
            user: this.user,
            get_recent: '1',
            is_archived: '0'
          }
        });
        console.log('Files data:', response.data);

        const files = response.data.map(file => {
          return {
            name: file.filename,
            type: this.simplifyType(file.metadata.contentType),
            download_url: file.url
          };
        });

        console.log('Files:', files);

        return files;
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    },

    simplifyType(type) {
      if (type.startsWith('image/')) {
        return 'image';
      } else if (type.includes('pdf')) {
        return 'pdf';
      } else if (type.includes('html')) {
        return 'code';
      } else {
        return '';
      }
    },

    getFileIcon(type) {
      switch (type) {
        case 'image':
          return 'bi bi-file-earmark-image text-success';
        case 'code':
          return 'bi bi-file-earmark-code text-danger';
        case 'pdf':
          return 'bi bi-file-earmark-pdf text-primary';
        default:
          return 'bi bi-file-earmark text-secondary';
      }
    },
    toggleDropdown(index) {
      this.dropdownIndex = this.dropdownIndex === index ? null : index;
      event.stopPropagation(); // Prevent the click from bubbling up
    },

    // Delete file handler
    async deleteFile(index) {
      this.file = this.files[index];
      this.filename = this.file.name;
      console.log(`Deleting file: ${this.filename}`);

      try {
        const request = await axios.get('http://localhost:3000/delete', {
          params: {
            user: this.user,
            filename: this.filename,
            in_trash: '0'
          }
        });
        console.log('Success!');
        this.$router.go() //Refresh
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    },

    // Download file handler
    async downloadFile(index) {
      this.file = this.files[index];
      this.filename = this.file.name;
      console.log(`Download file: ${this.filename}`);

      //try catch request to download the file
      try {
        const response = await axios.get('http://localhost:3000/download', {
          params: {
            user: this.user,
            filename: this.filename
          }
        });
        console.log('Download response:', response.data);

        //Now, we have to download the file using the url we got from the response.
        //For this, we need a link element and set the href to the url we got from the response.
        const link = document.createElement('a');
        link.href = response.data;

        // This just "appends" it and then removes it, so it doesn't show up in the DOM.
        document.body.appendChild(link);
        link.setAttribute('download', this.filename);
        link.click();
        document.body.removeChild(link);

      } catch (error) {
        console.error('Error downloading file:', error);
      }
    },

    // Rename file handler
    async renameFile(index) {
      this.file = this.files[index];
      this.filename = this.file.name;
      this.newfilename = this.filename;
      console.log(`Renaming file: ${this.filename}`);

      //TO FRONTEND PEOPLE: Make it look nicer, put it at the top of the screen or smth.
      const text = document.createElement('input');
      text.type = 'text';
      document.body.appendChild(text);
      text.focus();
      text.select();
      // When the user clicks enter, it becomes the new name.
      //Request time!
      try {
        this.newfilename = await new Promise((resolve) => {
          text.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              resolve(text.value);
              document.body.removeChild(text); // Remove the input field after renaming
            }
          });
        });

        console.log('New filename:', this.newfilename);
        console.log('Old filename:', this.filename);
        console.log('User:', this.user);
        const request = await axios.post('http://localhost:3000/rename', {
            user: this.user,
            oldName: this.filename,
            newName: this.newfilename
        });
        console.log('Successfully renamed to:', request.data);
        this.$router.go() //Refresh
      } catch (error) {
        console.error('Error renaming file:', error);
      }
    },

    // Close dropdown when clicking outside
    handleClickOutside(event) {
      if (this.dropdownIndex !== null && !event.target.closest('.dropdown')) {
        this.dropdownIndex = null;
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style scoped>
/* Main container with proper spacing for navbar and sidebar */
.files-browser-container {
  font-family: 'Segoe UI', Roboto, sans-serif;
  padding: 1rem;
  width: 80%; /* Adjusted width for better responsiveness */
  min-width: 100%;
  min-height: calc(100vh - 72px);
  transition: margin-left 0.3s ease;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.title-container h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Recent files section */
.section-title {
  color: #6c757d;
  margin-bottom: 0.75rem;
}

.recent-files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.file-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, background-color 0.2s ease;
}




.table-header, .table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
}

.table-header {
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
  color: #6c757d;
  font-weight: 600;
  font-size: 0.75rem;
}

.table-row {
  padding: 0.75rem 0;
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.2s ease;
  width: 100%;
}

.row-name {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.row-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.row-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.options-icon {
  color: #6c757d;
  cursor: pointer;
}

/* Hover effects */
.file-card:hover {
  background-color: #f5f5f5;
  transform: scale(1.02);
}

.table-row:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.row-size{
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Dark mode styles */
body.dark-mode .file-card {
  background-color: #333333;
}

body.dark-mode .file-card:hover {
  background-color: #474747;
}

body.dark-mode .table-row:hover {
  background-color: #444444;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .files-browser-container {
    margin-left: 0;
    width: 100%;
  }
  
  .recent-files-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

@media (max-width: 768px) {
  .table-header, .table-row {
    grid-template-columns: 3fr 1fr;
  }
  
  .header-updated, .row-updated {
    display: none;
  }
  
  .header-size, .row-size {
    text-align: right;
  }
}

@media (max-width: 576px) {
  .files-browser-container {
    padding: 0.75rem;
  }
  
  .recent-files-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }
  
  .file-icon {
    font-size: 1.5rem;
  }
  
  .file-name {
    font-size: 0.65rem;
  }
  
  .table-header, .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .row-name, .row-updated, .row-size {
    width: 100%;
  }
  
  .row-size {
    display: flex;
    justify-content: space-between;
  }
}
</style>