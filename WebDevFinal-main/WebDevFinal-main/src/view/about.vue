<template>
    <div class="about-container">
      <h1>About Us</h1>
      <p>Meet the team behind DigiBox:</p>
      
      <div class="members-list">
        <div v-for="(member, index) in members" :key="index" class="member-card">
          <img :src="member.image" alt="Member photo" class="member-photo" />
          <h3>{{ member.name }}</h3>
          <p>{{ member.role }}</p>
          <p>{{ member.contribution }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'About',
    data() {
      return {
        members: [
          {
            name: 'Aliseena Ahmar',
            role: 'Frontend Developer',
            contribution: 'ID: 100870078',    
            image: 'src/assets/member1.jpg' 
          },
          {
            name: 'Kershan Arulneswaran ',
            role: 'Backend Developer',
            contribution: 'ID: 100867282',
            image: 'src/assets/member2.jpg' 
          },
          {
            name: 'Moez Khan',
            role: 'Frontend Developer',
            contribution: 'ID: 100876478',
            image: 'src/assets/member3.jpg' 
          },
          {
            name: 'Haider Saleem',
            role: 'Backend Developer',
            contribution: 'ID: 100870637',
            image: 'src/assets/member4.jpg' 
          },
          {
            name: 'Simon Berhe',
            role: 'Frontend Developer',
            contribution: 'ID: 100866376',
            image: 'src/assets/member5.jpg' 
          },
          {
            name: 'Smit Kalathia',
            role: 'Frontend Developer',
            contribution: 'ID: 100871659',
            image: 'src/assets/member6.jpg' 
          }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  /* Styles for the About Us page */
  .about-container {
    margin-left: 250px; /* This moves the whole content to the right */
  }
  
  /* Title */
  h1 {
    font-size: 36px;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
    margin-top: -20px;
  }
  
  /* Paragraph text */
  p {
    font-size: 18px;
    color: #555;
    text-align: center;
  }
  
  /* Member list styles */
  .members-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px; /* Reduce gap between cards */
  }
  
  /* Member card */
  .member-card {
    background-color: #f9f9f9;
    padding: 15px; /* Reduced padding for smaller cards */
    border-radius: 10px;
    width: 180px; /* Decrease the width of the card */
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease; /* Smooth hover effect */
  }
  
  /* Member photo */
  .member-photo {
    width: 80px; /* Reduced size of the photo */
    height: 80px; /* Make the photo smaller */
    border-radius: 50%;
    margin-bottom: 10px; /* Reduced margin for compact layout */
  }

  /* Member name */
  .member-card h3 {
    font-size: 18px; /* Smaller font size for names */
    color: #333;
    margin-bottom: 8px; /* Reduced margin */
  }
  
  /* Member description */
  .member-card p {
    font-size: 12px; /* Smaller font size for description */
    color: #777;
  }
  
  /* Hover effect for the member card */
  .member-card:hover {
    transform: scale(1.05); /* Slightly enlarge the card on hover */
  }
  
  /* Dark Mode Styles */
  body.dark-mode .about-container {
    background-color: #202020; /* Dark background for the page */
  }
  
  body.dark-mode h1 {
    color: #ffffff; /* White text for the title */
  }
  
  body.dark-mode p {
    color: #bbbbbb; /* Light gray text for paragraphs */
  }
  
  body.dark-mode .members-list {
    gap: 20px; /* Slightly larger gap in dark mode */
  }
  
  body.dark-mode .member-card {
    background-color: #2a2a2a; /* Dark background for cards */
    color: #f1f1f1; /* Light text color */
    border: 1px solid #444444; /* Dark border around the card */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* Darker shadow */
  }
  
  body.dark-mode .member-card h3 {
    color: #ffffff; /* White text for member names */
  }
  
  body.dark-mode .member-card p {
    color: #bbbbbb; /* Light gray for the description text */
  }
  
  body.dark-mode .member-photo {
    border: 3px solid #f1f1f1; /* Light border for photos in dark mode */
  }
  
  body.dark-mode .member-card:hover {
    background-color: #333333; /* Darker hover effect for cards */
  }
  </style>