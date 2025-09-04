<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="icon-container">
        <img src="../assets/icon.png" alt="Icon" class="icon" />
      </div>

      <h1>Create Account</h1>
      
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

      <div class="form-group">
        <div class="password-wrapper">
          <label for="password">Password</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Create a password"
          />
          <span class="toggle-password" @click="togglePasswordVisibility">
            <i :class="showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
          </span>
        </div>
      </div>
      <div class="form-group">
        <div class="password-wrapper">
          <label for="confirmPassword">Confirm Password</label>
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            id="confirmPassword"
            v-model="confirmPassword"
            class="form-control"
            placeholder="Confirm your password"
          />
          <span class="toggle-password" @click="toggleConfirmPasswordVisibility">
            <i :class="showConfirmPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
          </span>
        </div>
      </div>

      <button @click="register" class="login-button">Sign Up</button>

      <div class="signup-prompt">
        Already have an account?
        <router-link to="/login" class="signup-link">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterPage",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      errorMessage: "",
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },  
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async register() {
      // Clear previous error messages
      this.errorMessage = "";
      
      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword,
          }),
        });

        // Parse the response
        const data = await response.text();
        
        if (!response.ok) {
          // Handle specific error messages from backend
          if (data.includes("Please provide email")) {
            this.errorMessage = "Please fill in all fields";
          } else if (data.includes("Invalid email format")) {
            this.errorMessage = "Please enter a valid email address";
          } else if (data.includes("Password must be at least")) {
            this.errorMessage = "Password must be at least 6 characters and include a number, uppercase letter, lowercase letter, and special character";
          } else if (data.includes("Passwords do not match")) {
            this.errorMessage = "Passwords do not match";
          } else if (data.includes("Email is already in use")) {
            this.errorMessage = "This email is already registered. Please use another email or login";
            } else if (data.includes("auth/email-already-in-use")) {
            this.errorMessage = "This email is already registered. Please use another email or login";
            } else {
            // Default error message
            this.errorMessage = data || "Registration failed";
            }
          return;
        }

        console.log("Registration successful:", data);
        this.$router.push("/login");
      } catch (error) {
        console.error("Registration failed:", error);
        this.errorMessage = "Something went wrong with the server. Please try again later.";
      }
    },
  },
};
</script>


<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  /* min-height: 100vh; */
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


.icon-container {
  margin-bottom: 20px;
}


.password-wrapper {
  position: relative;
}


.toggle-password {
  position: absolute;
  right: 14px;
  top: 70%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}


.forgotpassword {
  text-align: right;
  margin-top: 8px;
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
body.dark-mode .login-wrapper {
  background-color: #202020; /* Dark background for the page */
}

body.dark-mode .login-card {
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
.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 70%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}

.forgotpassword {
  text-align: right;
  margin-top: 8px;
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
</style>