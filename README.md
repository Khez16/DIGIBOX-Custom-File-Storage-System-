Our project is a custom file storage system built using everything that we have learned in the course, such as Vue, Express.js, D3, web services and more. It allows users to upload, delete, download and rename files that can be stored in their storage for future use. The secret behind this is Google's Firebase, which is why we wanted to build something like this in the first place. Firebase is also what we used for the 'new' component that was not taught in class. Firebase Authentication, the Firestore database and cloud Storage API methods were utilized in the server's custom API calls that provides a secure experience.

Group Members
Moez Khan - 100876478
Kershan Arulneswaran - 100867282
Simon Berhe - 100866376
Haider Saleem - 100870637
Aliseena Ahmar - 100870078
Smit Kalathia - 100871659
Contributions and relevant LLM prompts used in the the development of this project are in the respective text files.

Video Demo
Check intro.mp4.

Features
Secure Sessions: With Firebase, all of your files will be secure and will never leak to other users.
Improved Accessibility: Dark Mode enables another level of accessibility, making it useful for nighttime sessions and pop on OLED screens.
Enhanced User Interface: Responsive and intuitive user interface for smooth navigation and an enjoyable experience with DigiBox.
Getting Started
To get started, follow these steps:

After downloading and extracting the zip file (or just cloning it), run:
npm install
The next few steps are mandatory, as the server hasn't been hosted yet. Create a new .env file that has Firebase credentials. If you don't have a Firebase project set up yet, set a project up, paste the credentials and follow along. If you already have one, go to step 4.
In Firebase, set up Authentication, Firestore and Storage. Rules for the Firestore and Storage must be public.
Run:
npm run dev
in one terminal and
node app.js
in another.
Load the localhost URL.
Create a new account if you don't have one.
Sign in.
You are now ready to upload files to DigiBox! [NOTE: You must refresh whenever you upload files on DigiBox.]
Special Thanks
We would like to credit the following:

Box for UI Inspiration
Express.js for the server
Axios for asynchronous requests
Firebase for the 'new' component
Multer for file uploads
Bootstrap Themes also for UI Inspiration
Bootstrap Icons for icons
Vue for client side code
