<template>
  <div class="files-container p-4">
    <!-- Header with All Files and New button -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center">
        <h1 class="mb-0 fs-4">All Trashed Files</h1>
        <i class="bi bi-caret-down-fill ms-2 text-muted"></i>
      </div>
    </div>
    
    <!-- Recent Files Section -->
    <h6 class="text-muted mb-3">Recent Deleted Files</h6>
    
    <!-- Recent Files Grid -->
    <div class="d-flex mb-4 gap-3 overflow-auto">
      <div v-for="(file, index) in recentFiles" :key="index" class="col">
        <div class="card h-100 shadow-sm border-0 file-card text-center p-3">
          <i :class="getFileIcon(file.type)" class="fs-1 mb-2"></i>
          <div class="file-name text-truncate small fw-medium" :title="file.name">{{ file.name }}</div>
        </div>
      </div>
    </div>
    
    <!-- Files Table Header -->
    <div class="d-flex align-items-center py-2 border-bottom">
      <div class="d-flex align-items-center" style="width: 50%;">
        <span class="fw-bold">Name</span>
        <i class="bi bi-caret-down-fill ms-1 text-muted small"></i>
      </div>
      <div style="width: 25%;" class="fw-bold">Trash Date</div>
      <div style="width: 25%;" class="text-center fw-bold">Size</div>
    </div>
    
    <!-- Folders List -->
    <div v-for="(file, index) in files" :key="index" class="d-flex align-items-center py-3 border-bottom hover-bg-light folder-row" style="width: 100%;">
  <!-- adjust min-width for size -->
  <div class="d-flex align-items-center" style="width: 50%;">
    <i :class="getFileIcon(file.type)" style="font-size: 24px;"></i>
    <span class="fw-semibold">{{ file.name }}</span>
  </div>
  <div style="width: 25%;">{{ file.date }}</div>
  <div style="width: 25%; display: flex; justify-content: space-between; align-items: center;" class="row-size">
    <div style="flex: 1; text-align: center;">{{ file.size }}</div>
    <DropdownTrash
      :fileIndex="index" 
      :isOpen="dropdownIndex === index"
      @toggle="toggleDropdown"
      @delete="deleteFile"
      @restore="restoreFile" />
  </div>
</div>
    </div>
</template>

<script>
import DropdownTrash from '../components/TrashDropdown.vue';
import axios from 'axios';
export default {
  name: 'FilesBrowser',
  components: {
    DropdownTrash
  },
  // For this, we have to return all the files based on the firestore 'files/user' collection.
  data() {
    return {
      user: null,
      recentFiles: [],
      files: [],
      dropdownIndex: null
    }
  },
  async created(){
    await this.loadStuff();
  },
  methods: {
    // Load the user, stringify and get files
    async loadStuff() {
      this.user = await this.getSession();
      this.user = JSON.stringify(this.user);
      this.recentFiles = await this.getRecentFiles();
      this.files = await this.getFiles();
    },

    //Code to get signed up user
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
      try{
        const response = await axios.get('http://localhost:3000/files', {
          params: {
            user: this.user,
            get_recent: '0',
            is_archived: '1'
          }
        });
        console.log('Files data:', response.data);

        // Writing it to another array with just name, type and download url
        const files = response.data.map(file => {
          return {
            name: file.filename,
            type: this.simplifyType(file.metadata.contentType),
            date: file.date,
            size: Math.round(file.size/1024)+'KB',
            download_url: file.url
          };
        });

        console.log('Files:', files);
        
        return files;
      }catch (error) {
        console.error('Error fetching files:', error);
      }
    },

    //Code to get the most recent files
    async getRecentFiles() {
      try{
        const response = await axios.get('http://localhost:3000/files', {
          params: {
            user: this.user,
            get_recent: '1',
            is_archived: '1'
          }
        });
        console.log('Files data:', response.data);

        // Writing it to another array with just name, type and download url
        const files = response.data.map(file => {
          return {
            name: file.filename,
            type: this.simplifyType(file.metadata.contentType),
            download_url: file.url
          };
        });

        console.log('Files:', files);   
        
        return files;
      }catch (error) {
        console.error('Error fetching files:', error);
      }
    },

    //Helper Function to simplify the type
    simplifyType(type) {
      if (type.startsWith('image/')) {
        return 'image';
      } else if(type.includes('pdf')) {
        return 'pdf';
      } else if(type.includes('html')) {
        return 'code';
      } else {
        return '';
      }
    },

    // Function to get the icon class based on file type
    getFileIcon(type) {
      switch(type) {
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

  //delting the folder place holder
  async deleteFile(index) {
      this.file = this.files[index];
      this.filename = this.file.name;
      console.log(`Deleting file: ${this.filename}`);

      try{
        const request = await axios.get('http://localhost:3000/delete', {
          params: {
            user: this.user,
            filename: this.filename,
            in_trash: '1'
          }
        });
        console.log('Success!');
        this.$router.go() //Refresh
      }catch (error) {
        console.error('Error deleting file:', error);
      }
    },
  //Restoreing the file handler
  async restoreFile(index) {
      this.file = this.files[index];
      this.filename = this.file.name;
      console.log(`Deleting file: ${this.filename}`);

      try{
        const request = await axios.get('http://localhost:3000/restore', {
          params: {
            user: this.user,
            filename: this.filename
          }
        });
        console.log('File has been restored!');
        this.$router.go() //Refresh
      }catch (error) {
        console.error('Error deleting file:', error);
      }
    },
  handleClickOutside(event) {
   if (this.dropdownIndex !== null && !event.target.closest('.dropdown')) {
      this.dropdownIndex = null;
    }
  },
    getFileIcon(type) {
      switch(type) {
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
  },
  mounted() {
  // evnet listener for closing dropdown when person clicks outside of the doprdown
  document.addEventListener('click', this.handleClickOutside);
 },
  beforeUnmount() {
    //gets rid of the dropdown when selcing one of the 2 options of the dropdown
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style scoped>
.files-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  padding: 1rem;
  width: 80%; /* Adjusted width for better responsiveness */
  min-width: 100;
  min-height: calc(100vh - 72px);
  transition: margin-left 0.3s ease;
}

/* Light Mode Hover */
.hover-bg-light:hover {
  background-color: #f8f9fa;
} 

/* Dark Mode Hover */
body.dark-mode .hover-bg-light:hover {
  background-color: #444444; /* Dark gray for hover state in dark mode */
}

/* Cursor pointer style */
.cursor-pointer {
  cursor: pointer;
}

/* row size */
.row-size{
  display: flex;
  justify-content: center;
  align-items: center;
}

/* File card styling */
.file-card {
  transition: all 0.2s ease;
}

/* Light mode file card hover */
.file-card:hover {
  background-color: #f0f0f0;
}

/* Dark mode file card hover */
body.dark-mode .file-card {
  background-color: #333333; /* Dark gray for file card hover in dark mode */
}

/* Folder row styling */
.files-list .d-flex {
  transition: background-color 0.2s ease;
}

/* Light mode folder row hover */
.files-list .d-flex:hover {
  background-color: #f8f9fa;
}

/* Dark mode folder row hover */
body.dark-mode .files-list .d-flex:hover {
  background-color: #444444; /* Dark gray for folder hover in dark mode */
}
</style>
