<template>
    <button class="btn btn-outline-secondary rounded-3 px-3" @click="upload()">
        New <i class="bi bi-plus ms-1"></i>
    </button>
</template>

<script>
import axios from 'axios';
export default {
    name: "NewButton",
    methods: {
        async upload() {
            //First, we have to fetch the current user.
            this.user = await this.getSession();
            
            // Now, we convert to string w/stringify
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
            const user = JSON.stringify(this.user);

            // Logic to handle file upload
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
            fileInput.accept = '.jpeg,.jpg,.png,.pdf,.doc,.docx,.html';

            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    // Formdata should be used here, as JSON will not work for this
                    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects 
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('user', user);

                    fetch('http://localhost:3000/upload', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Upload failed with status: ${response.status}`);
                        }
                        // The server sends plain text URL, not JSON
                        console.log('Upload successful:', response); 
                        return response.text(); 
                    })
                    .catch(error => {
                        document.getElementById('result').textContent = 
                            `Error: ${error.message}`;
                        console.error('Upload error:', error);
                    });
                }
            });
            fileInput.click(); // Open file selector
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
        }
    }
};
</script>