<template>
  <div class="forgot-wrapper">
    <div class="forgot-card">
      <div class="icon-container">
        <img src="../assets/icon.png" alt="Icon" class="icon" />
      </div>
      
      <h1>Reset Password</h1>
      
      <!-- Success message display area -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <!-- Error message display area -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          class="form-control" 
          placeholder="Enter your email"
        />
      </div>
      
      <button @click="forgotPassword" class="login-button">Send email</button>
      
      <div class="signup-prompt">
        Sign In? <router-link to="/login" class="signup-link">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordPage',
  data() {
    return {
      email: '',
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async forgotPassword() {
      // Clear previous messages
      this.errorMessage = '';
      this.successMessage = '';
      
      if (!this.email) {
        this.errorMessage = 'Please enter your email address';
        return;
      }
      
      try {
        const response = await fetch('http://localhost:3000/forgotpassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email
          })
        });
        
        const data = await response.text();
        
        if (!response.ok) {
          // Handle different error cases
          if (data.includes('Invalid email format')) {
            this.errorMessage = 'Please enter a valid email address';
          } else if (data.includes('Email not registered')) {
            this.errorMessage = 'This email is not registered in our system';
          } else {
            this.errorMessage = data || 'An error occurred. Please try again.';
          }
          return;
        }
        
        // Success case
        this.successMessage = 'An email has been sent with instructions to reset your password';
        this.email = ''; // Clear the email field
      } catch (error) {
        console.error('Error details:', error);
        this.errorMessage = 'Unable to connect to the server. Please try again later.';
      }
    }
  }
}
</script>

<style scoped>
.forgot-wrapper {
display: flex;
justify-content: center;
align-items: center;
/* min-height: 100vh; */
box-sizing: border-box;
background-color: white;
margin: 0;
padding: 0;

}

.forgot-card {
background-color: white;
border-radius: 1px;
box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
padding: 25px 30px;
width: 90% !important;
max-width: 450px;
min-width: 400px;
text-align: center;
box-sizing: border-box;
}

.icon-container {
margin-bottom: 20px;
}

.icon {
width: 60px;
height: 60px;
}

h1 {
font-size: 24px;
margin-bottom: 25px;
color: #333;
}

.form-group {
margin-bottom: 20px;
text-align: left;
}

label {
display: block;
margin-bottom: 8px;
font-weight: 500;
color: #333;
}

.form-control {
width: 100%;
padding: 10px;
border: 1px solid #ddd;
border-radius: 4px;
font-size: 16px;
box-sizing: border-box;
}

.forgot-password {
text-align: right;
margin-top: 5px;
}

.forgot-password a {
color: #666;
font-size: 14px;
text-decoration: none;
}

.login-button {
background-color: #0d6efd;
color: white;
border: none;
border-radius: 4px;
padding: 12px;
width: 100%;
font-size: 16px;
cursor: pointer;
margin: 10px 0 20px;
}

.signup-prompt {
font-size: 14px;
color: #333;
}

.signup-link {
color: #0d6efd;
text-decoration: none;
font-weight: 500;
}

/* Dark Mode Styles */
body.dark-mode .forgot-wrapper {
background-color: #202020; /* Dark background for the page */
}

body.dark-mode .forgot-card {
background-color: #202020; /* Dark background for the card */
color: #f1f1f1; /* Light text color */
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* Darker shadow */
}

body.dark-mode h1 {
color: #ffffff; /* White text for the title */
}

body.dark-mode label {
color: #bbb; /* Light gray text for labels */
}

body.dark-mode .form-control {
background-color: #2a2a2a; /* Dark input fields */
border: 1px solid #444; /* Dark border */
color: #f1f1f1; /* Light text in inputs */
}

body.dark-mode .forgot-password a {
color: #bbb; /* Light gray color for links */
}

body.dark-mode .forgot-password a:hover {
color: #0d6efd; /* Highlight on hover */
}

body.dark-mode .login-button {
background-color: #0d6efd;
color: white;
border-radius: 4px;
padding: 12px;
width: 100%;
font-size: 16px;
cursor: pointer;
}

body.dark-mode .signup-prompt {
color: #bbb; /* Light gray color for signup prompt */
}

body.dark-mode .signup-link {
color: #0d6efd;
}

body.dark-mode .signup-link:hover { 
text-decoration: underline;
}

.error-message {
  background-color: #fde8e8;
  color: #e53e3e;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: left;
  border-left: 4px solid #e53e3e;
}

/* Success message styling */
.success-message {
  background-color: #e6f7ef;
  color: #10b981;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: left;
  border-left: 4px solid #10b981;
}
</style>