<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="icon-container">
        <img src="../assets/icon.png" alt="Icon" class="icon" />
      </div>

      <h1>Welcome!</h1>
      
      <!-- Error message display area -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="login">
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

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password" 
              class="form-control" 
              placeholder="Enter your password"
            />
            <span class="toggle-password" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
            </span>
          </div>
          <div class="forgotpassword">
            <router-link to="/forgotpassword" class="forgot-password">Forgot password?</router-link>
          </div>
        </div>

        <button type="submit" class="login-button">Log In</button>
      </form>

      <div class="d-flex align-items-center my-3">
        <hr class="flex-grow-1" style="height: 1px; background-color: #ddd;" />
        <span class="mx-2 text-muted">or</span>
        <hr class="flex-grow-1" style="height: 1px; background-color: #ddd;" />
      </div>

      <div class="signup-prompt">
        Don't have an account? <router-link to="/signup" class="signup-link">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      errorMessage: ''
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async login() {
    this.errorMessage = ''; // Clear previous error
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      });
        
        if (!response.ok) {
          // Handle specific error codes from backend
          if (data.errorCode === 'auth/wrong-password') {
            this.errorMessage = 'Incorrect password. Please try again.';
          } else if (data.errorCode === 'auth/invalid-credential') {
            this.errorMessage = 'Please check your email and password.';
          } else if (data.errorCode === 'auth/user-not-found') {
            this.errorMessage = 'Email not registered. Please check your email or sign up.';
          } else if (data.errorCode === 'auth/invalid-email') {
            this.errorMessage = 'Invalid email format.';
          } else if (data.errorCode === 'auth/too-many-requests') {
            this.errorMessage = 'Too many failed login attempts. Please try again later.';
          } else {
            // Fallback to general error or server provided message
            this.errorMessage = data.errorMessage || 'Login failed. Please try again.';
          }
          return;
        }

        // If login successful
        this.$router.push('/home'); // or wherever
      } catch (error) {
        this.errorMessage = 'Please check your email and password.';
        console.error('Login error:', error);
      }
    }
  }
}
</script>


<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  margin: 0;
  padding: 0;
}


.login-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 25px 30px;
  width: 90% !important;
  max-width: 450px;
  min-width: 400px;
  text-align: center;
  box-sizing: border-box;
}


@media (max-width: 768px) {
  .login-card {
    padding: 20px;
    width: 95%;
  }
}


@media (max-width: 480px) {
  .login-card {
    padding: 15px;
    width: 100%;
  }
}



.password-wrapper {
  position: relative;
}


.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}


.forgotpassword {
  text-align: right;
  margin-top: 8px;
}

.icon-container {
  margin-bottom: 20px;
}

.icon {
  width: 65px;
  height: 65px;
}

h1 {
  font-size: 26px;
  margin-bottom: 25px;
  color: #333;
  font-weight: 600;
}

.form-group {
  margin-bottom: 22px;
  text-align: left;
  position: relative;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 15px;
}

.form-control {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
}

.forgotpassword{
  text-align: right;
  margin-top: 8px;
}

.forgot-password {
  text-align: right;
}

.forgot-password a {
  color: #666;
  font-size: 14px;
  text-decoration: none;
}

.forgot-password a:hover {
  color: #0d6efd;
  text-decoration: underline;
}

.login-button {
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 13px;
  width: 75%;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin: 12px 0 20px;
  transition: all 0.2s ease;
}

.login-button:hover {
  background-color: #0b5ed7;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
}

.login-button:active {
  transform: translateY(1px);
  box-shadow: none;
}

.signup-prompt {
  font-size: 15px;
  color: #333;
}

.signup-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}

/* Dark Mode Styles */
body.dark-mode .login-wrapper {
  background-color: #202020; /* Dark background for the page */
}

body.dark-mode .login-card {
  background-color: #202020; /* Dark background for the card */
  color: #f1f1f1; /* Light text color */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3); /* Darker shadow */
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

body.dark-mode .form-control:focus {
  border-color: #0d6efd; /* Highlight border in dark mode */
}

body.dark-mode .forgotpassword a {
  color: #bbb; /* Light gray color for links */
}

body.dark-mode .forgotpassword a:hover {
  color: #0d6efd; /* Highlight on hover */
}

body.dark-mode .login-button {
  background-color: #0d6efd;
  color: white;
  border-radius: 8px;
  padding: 13px;
  width: 75%;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin: 12px 0 20px;
}

body.dark-mode .login-button:hover {
  background-color: #0b5ed7;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
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

body.dark-mode .login-with-google-btn {
  background-color: #2a2a2a; /* Dark background for Google button */
  color: #f1f1f1; /* Light text for button */
  border: 1px solid #444;
}

body.dark-mode .login-with-google-btn:focus {
  background-color: #333;
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
.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}

.forgotpassword {
  text-align: right;
  margin-top: 8px;
}
</style>