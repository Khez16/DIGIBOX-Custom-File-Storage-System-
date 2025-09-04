# DigiBox 

Our project is a custom file storage system built using everything that we have learned, such as Vue, Express.js, D3, web services and more. It allows users to upload, delete, download and rename files that can be stored in their storage for future use. The secret behind this is Google's Firebase, which is why we wanted to build something like this in the first place. Firebase is also what we used for the 'new' component that was not taught in class. Firebase Authentication, the Firestore database and cloud Storage API methods were utilized in the server's custom API calls that provides a secure experience.

## Group Members

* [Moez Khan](https://github.com/MoezKhan1) - 100876478
* [Kershan Arulneswaran](https://github.com/Koops0) - 100867282
* [Simon Berhe](https://github.com/SimonB0525) - 100866376
* [Haider Saleem](https://github.com/Haider425) - 100870637
* [Aliseena Ahmar](https://github.com/aliseena-a) - 100870078
* [Smit Kalathia](https://github.com/Smitkalathia) - 100871659

Contributions and relevant LLM prompts used in the the development of this project are in the respective text files.

## Video Demo
Check intro.mp4.

## Features

* Secure Sessions: With Firebase, all of your files will be secure and will never leak to other users.
* Improved Accessibility: Dark Mode enables another level of accessibility, making it useful for nighttime sessions and pop on OLED screens.
* Enhanced User Interface: Responsive and intuitive user interface for smooth navigation and an enjoyable experience with DigiBox.

## Getting Started

To get started, follow these steps:

1. After downloading and extracting the zip file (or just cloning it), run:
   ```bash
   npm install
   ```
2. The next few steps are mandatory, as the server hasn't been hosted yet. Create a new .env file that has Firebase credentials. If you don't have a Firebase project set up yet, set a project up, paste the credentials and follow along. If you already have one, go to step 4.
3. In Firebase, set up Authentication, Firestore and Storage. Rules for the Firestore and Storage must be public.
4. Run:
   ```bash
   npm run dev
   ```
   in one terminal and
   ```bash
   node app.js
   ```
   in another.
5. Load the localhost URL.
6. Create a new account if you don't have one.
7. Sign in.
8. You are now ready to upload files to DigiBox! [NOTE: You must refresh whenever you upload files on DigiBox.]

## Special Thanks
We would like to credit the following:
* [Box](https://www.box.com/en-ca/home) for UI Inspiration
* [Express.js](https://expressjs.com/en/5x/api.html) for the server
* [Axios](https://axios-http.com/docs/intro) for asynchronous requests
* [Firebase](https://firebase.google.com/docs) for the 'new' component
* [Multer](https://www.npmjs.com/package/multer) for file uploads
* [Bootstrap Themes](https://themes.getbootstrap.com) also for UI Inspiration
* [Bootstrap Icons](https://icons.getbootstrap.com) for icons
* [Vue](https://vuejs.org/guide/introduction.html) for client side code
