<template>
    <div class="files-container py-4 px-3 px-md-5">
      <!-- Title Section Above the Table -->
      <div class="d-flex align-items-center mb-3">
        <h1 class="mb-0 fs-3 fw-semibold">📁 All Files</h1>
      </div>
  
      <!-- File List Section on the Left -->
      <div class="file-list">
        <div class="file-header mb-3">
          <div class="name">Name</div>
          <div class="updated">Updated</div>
          <div class="size">Size</div>
        </div>
        <ul class="file-items">
          <li v-for="(file, index) in files" :key="index" class="file-item">
            <div class="file-details">
              <div class="name">{{ file.name }}</div>
              <div class="updated">{{ file.date }}</div>
              <div class="size">{{ file.size }}</div>
            </div>
          </li>
        </ul>
      </div>
  
      <!-- D3 Chart Section on the Right -->
      <div class="bar-chart-container">
        <svg ref="barChart" width="500" height="400"></svg>
      </div>
    </div>
  </template>
  
  <script>
  import * as d3 from 'd3';
  import axios from 'axios';
  
  export default {
    name: 'FilesWithChart',
    data() {
      return {
        files: [], // Will hold the files fetched from the backend
        user: null,
      };
    },
    async created() {
      await this.loadStuff(); // Load user and files when component is created
    },
    methods: {
      // Load the user and files
      async loadStuff() {
        this.user = await this.getSession();
        this.user = JSON.stringify(this.user);
        this.files = await this.getFiles();
        this.createBarChart(); // Create the chart once files are loaded
      },
  
      // Fetch session (user) data
      async getSession() {
        try {
          const response = await axios.get('http://localhost:3000/session');
          return response.data;
        } catch (error) {
          console.error('Error fetching session:', error);
        }
      },
  
      // Fetch all files
      async getFiles() {
        try {
          const response = await axios.get('http://localhost:3000/files', {
            params: {
              user: this.user,
              get_recent: '0',
              is_archived: '0',
            },
          });
  
          const files = response.data.map(file => ({
            name: file.filename,
            date: file.date,
            size: Math.round(file.size / 1024) + 'KB', // Convert bytes to KB
            download_url: file.url,
          }));
  
          return files;
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      },
  
      // Create the bar chart using D3
      createBarChart() {
        const margin = { top: 20, right: 30, bottom: 140, left: 80 };
        const width = 500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Clear any existing SVG content
        d3.select(this.$refs.barChart)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
  
        const svg = d3
          .select(this.$refs.barChart)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);
  
        // Parse the files' size data to numeric values for the chart
        const parsedData = this.files.map(file => ({
          name: file.name,
          size: parseInt(file.size.replace('KB', '')), // Convert the KB string to an integer
        }));
  
        const x = d3
          .scaleBand()
          .domain(parsedData.map(d => d.name))
          .range([0, width])
          .padding(0.1);
  
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(parsedData, d => d.size)])
          .nice()
          .range([height, 0]);
  
        svg
          .selectAll(".bar")
          .data(parsedData)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", d => x(d.name))
          .attr("y", d => y(d.size))
          .attr("width", x.bandwidth())
          .attr("height", d => height - y(d.size))
          .attr("fill", "#007bff");
  
        // Add Y axis
        svg
          .append("g")
          .call(d3.axisLeft(y).ticks(5))
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -60)
          .attr("x", -height / 2)
          .attr("text-anchor", "middle")
          .text("File Size (KB)")
          .attr("fill", "#666");
  
        // Add X axis with rotated labels
        svg
          .append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "translate(-10,10)rotate(-45)")
          .style("text-anchor", "end")
          .style("font-size", "12px");
      },
    },
  };
  </script>
  
  <style scoped>
  .files-container {
    display: flex;
    flex-direction: column; /* displays it vertically, If we want we can adjust to row later ill have to talk to the group */
    justify-content: flex-start;
    align-items: flex-start;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  .file-list {
    width: 100%; /* Make the file list take up the full width */
    border: 1px solid #eaeaea;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .file-header {
    display: flex;
    padding: 10px 15px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #eaeaea;
    font-weight: 600;
  }
  
  body.dark-mode .file-header {
    background-color: #444444; /* Dark gray for header in dark mode */
  }
  
  .file-items {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .file-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #eaeaea;
  }
  
  .file-item:last-child {
    border-bottom: none;
  }
  
  .file-details {
    display: flex;
    flex: 1;
  }
  
  .name, .updated, .size {
    padding-right: 15px;
  }
  
  .name {
    flex: 3;
    color: #666;
  }
  
  .updated {
    flex: 2;
    color: #666;
    font-size: 14px;
  }
  
  .size {
    flex: 1;
    text-align: right;
    color: #666;
    font-size: 14px;
  }
  
  .bar-chart-container {
    width: 80%;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.0);
  }
  
  body.dark-mode .bar-chart-container {
    background-color: #202020; /* Dark background for the chart container */
  }
  
  .bar {
    transition: all 0.2s ease-in-out;
  }
  
  .bar:hover {
    fill: #0056b3;
  }
  </style>
  