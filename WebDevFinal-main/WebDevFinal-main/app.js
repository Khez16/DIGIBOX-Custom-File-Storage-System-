// This is an Express server that takes the commands from the client and stores
// into Firebase. We're using Authentication for user auth, Storage to save files
// and Firestore to store the metadata of the files.

// Package imports
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'

// Firebase imports
// I'm citing documentation based on which APIs we're using for that specific API callng 
// This isn't the same as just straight up copy and paste, as we're using the APIs in a different way,
// but I'm still citing them for the sake of transparency.
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";

// Initialize the app
const app = express()

// We must use middleware for server to work correctly.
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const upload = multer() //This is important for files

//Set port
const port = 3000

// firebase variable, again, we're using express.
// These are stored in an environment variable for security reasons.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase, Firestore, Storage and Auth
// https://firebase.google.com/docs/web/setup
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);
const storage = getStorage(fbApp);
const auth = getAuth();

// Helper function for email validation
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// Helper function for password strength validation
const isValidPassword = (password) => {
  const minLength = 6;
  // At least one number, one lowercase, one upper case, one special character, and minimum length of 6 characters
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password) && password.length >= minLength;
};

//Register call to register a user
app.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Check if fields are empty
  if (!email || !password || !confirmPassword) {
    return res.status(400).send('Please provide email, password, and confirm password');
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).send('Invalid email format');
  }

  // Validate password strength
  if (!isValidPassword(password)) {
    return res.status(400).send('Password must be at least 6 characters long, include a number, an uppercase letter, a lowercase letter, and a special character');
  }

  // Validate that password and confirmPassword are the same
  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    // Create user with email and password fn
    // https://firebase.google.com/docs/auth/web/password-auth
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        res.status(200).send('User Created');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(400).send({ errorCode, errorMessage });
      });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Login API call to log in a user
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if fields are empty
  if (!email || !password) {
    return res.status(400).send('Please provide email and password');
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).send('Invalid email format');
  }

  // Sign in with email and password
  // https://firebase.google.com/docs/auth/web/password-auth
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.status(200).send('The user has successfully logged in');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(400).send({ errorCode, errorMessage });
    });
});

//Forgotpassword call, used for sending a password reset email to the user
app.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;
  console.log(email);

  // Check if email is provided
  if (!email) {
    return res.status(400).send('Please provide an email');
  }

  // Check if email format is valid
  if (!isValidEmail(email)) {
    return res.status(400).send('Invalid email format');
  }

  // Check if email exists before sending reset email
  try {
    // Send password reset email
    // https://firebase.google.com/docs/auth/web/manage-users
    sendPasswordResetEmail(auth, email)
      .then(() => {
        res.status(200).send('Password reset email sent');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(400).send({ errorCode, errorMessage });
      });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

//Upload call, used to upload a file to Firebase Storage and Firestore
app.post('/upload', upload.single('file'), (req, res) => {
  // First, we have to parse the file from the request body.
  // We do it through Multer, as it can handle formdata and multiple
  // files at once. This is through a recommendation from Express.js
  // https://expressjs.com/en/5x/api.html#req.body
  // https://www.npmjs.com/package/multer#readme

  const file = req.file;

  // Multer related stuff: https://www.npmjs.com/package/multer
  const filename = file.originalname;
  const size = file.size;

  // User uses the body instead of file.
  const user = req.body.user;
  console.log('User:', user);

  // This is the metadata for the file, which is used to store information about the file.
  const metadata = {
    contentType: file.mimetype,
    definition: 'This is a ' + file.mimetype + ' file.'
  };

  // Now, we can upload the file to storage and generate a URL to access it.
  // https://firebase.google.com/docs/storage/web/upload-files
  const storageRef = ref(storage, 'files/' + user + '/' + filename);

  //After this, we can create a blob to access the file and upload to storage. (Taken from docs)
  uploadBytes(storageRef, file.buffer).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    return getDownloadURL(storageRef);
  })
    .then((url) => {
      console.log('File available at', url);

      // from the URL, we can create a new constant to store the file in the database.
      const fileData = {
        filename: filename,
        url: url,
        size: size,
        user: user,
        date: new Date().toDateString(), //Best for keeping track of when user uploaded the file
        archived: false, //Need this for Trash 
        metadata: metadata
      };

      // Now, we can add it to the database with setDoc
      // https://firebase.google.com/docs/firestore/manage-data/add-data
      setDoc(doc(db, 'files/users/' + user, filename), fileData)
        .then(() => {
          // We send this as both a clog and a response to the client.
          console.log('File data added to Firestore!');
          res.status(200).send('File data added to Firestore!');
        });
    }).catch((error) => {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
    });
});

//Gets currently signed in user and grabs their ID
//https://firebase.google.com/docs/auth/web/manage-users
app.get('/session', (req, res) => {
  const user = auth.currentUser;
  if (user) {
    // User is signed in.
    console.log('User is signed in:', user.uid);
    res.status(200).send(user.uid);
  } else {
    // No user is signed in.
    console.log('No user is signed in');
    res.status(400).send('No user is signed in');
  }
});

//Files call, used to get the files of that user from the database
app.get('/files', async (req, res) => {
  const { user, get_recent, is_archived } = req.query;

  //Flags for recent files and archived files
  let recent_files_flag = false;
  let archive_flag = false;
  if (get_recent === '1') {
    recent_files_flag = true;
  } if (is_archived === '1') {
    archive_flag = true;
  }

  console.log(recent_files_flag);
  console.log(archive_flag);

  //https://firebase.google.com/docs/firestore/query-data/get-data
  const querySnapshot = await getDocs(collection(db, 'files/users/' + user));

  // Need arrays to separate files and archived files
  let file_array = [];
  const archive_array = [];

  //If there's no files, we send an empty array to the client.
  if (querySnapshot.empty) {
    res.status(200).send(file_array);
    console.log('No files found for user:', user);
    return;
  }

  // Toggle for archived files
  querySnapshot.forEach((doc) => {
    if (doc.data().archived == true) {
      archive_array.push(doc.data());
    } else {
      file_array.push(doc.data());
    }
  });

  // Replace with archive_array if user is in trash
  if (archive_flag == true) {
    file_array = archive_array;
  }

  // This flag represents whether the user wants to get recent files or all files.
  // For this, we get the 5 latest files from the array, according to how they were uploaded.
  if (recent_files_flag == true) {
    const recent_files = file_array.slice(-5);
    res.status(200).send(recent_files);
    console.log('Recent files sent');
  } else {
    res.status(200).send(file_array);
    console.log('Files sent');
  }
});

// Rename a file endpoint
app.post('/rename', async (req, res) => {
  const { user, oldName, newName } = req.body;
  console.log('User:', user);
  console.log('Old Name:', oldName);
  console.log('New Name:', newName);

  //Using the same function as upload, we can rename the file in the database.
  // https://firebase.google.com/docs/firestore/manage-data/add-data
  // https://firebase.google.com/docs/firestore/query-data/get-data
  const fileRef = doc(db, 'files/users/' + user, oldName);
  const fileSnapshot = await getDoc(fileRef);

  //check if file exists
  if (!fileSnapshot.exists()) {
    console.log('File does not exist');
    return res.status(404).send('File does not exist');
  }

  //grab data from the old file to keep in new
  const oldFile = fileSnapshot.data();
  const newFile = {
    ...oldFile, // ... = copying all the data from the old file
    filename: newName,
    date: new Date().toDateString() // Update the date to the current date
  }

  // Storage refs
  // https://firebase.google.com/docs/storage/web/upload-files 
  const storageRef = ref(storage, 'files/' + user + '/' + oldName);
  const newStorageRef = ref(storage, 'files/' + user + '/' + newName);

  // Firebase API Calls: https://firebase.google.com/docs/firestore/manage-data
  // https://firebase.google.com/docs/storage/web
  // Rest is my own.
     try{
      // Delete the old file from storage
      // We must keep the same url, so we grab it and make a new blob
      const url = oldFile.url;
      const response = await fetch(url);
      const blob = await response.blob();

      // Uploaded file
      await uploadBytes(newStorageRef, blob);

      //Now, we can delete the old file from storage
      await deleteObject(storageRef);
      console.log('Old file deleted from storage!');

      //Extract the metadata URL from the new reference and store to file
      const newURL = await getDownloadURL(newStorageRef);
      newFile.url = newURL;

      //set a new doc with the new name and data and deleting the other one
      await setDoc(doc(db, 'files/users/' + user, newName), newFile);
      deleteDoc(fileRef);

      console.log('File has been renamed successfully!');
      res.status(200).send('File has been renamed successfully!');
     }catch(error){
      console.error('Error renaming file:', error);
      res.status(500).send('Error renaming file');
     }
  });

  // Download files endpoint
  app.get('/download', async (req, res) => {
    console.log('Query params:', req.query);
    try {
      const { user, filename } = req.query;

      console.log('User:', user);
      console.log('Filename:', filename);

      // Get the file URL from Firestore
      // https://firebase.google.com/docs/firestore/query-data/get-data
      const fileRef = doc(db, 'files/users/' + user, filename);
      const fileDoc = await getDoc(fileRef);
      
      //check if the file actually exists
      if (!fileDoc.exists()) {
        console.log('No document exists!');
        return res.status(404).send('File not found');
      }

      //Extract the URL
      const url = fileDoc.data().url;
      res.status(200).send(url);
      console.log('File URL:', url);

    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).send('Error downloading file');
    };
  });

  // Delete files endpoint
  app.get('/delete', async (req, res) => {
    const { user, filename, in_trash } = req.query;

    //This is an archive flag, it will be useful
    let archived = false;
    if (in_trash === '1') {
      archived = true;
    }

    console.log('Archived:', archived);

    //References
    // https://firebase.google.com/docs/firestore/query-data/get-data
    // https://firebase.google.com/docs/storage/web/upload-files
    const fileRef = doc(db, 'files/users/' + user, filename);
    const storageRef = ref(storage, 'files/' + user + '/' + filename);

    if (archived == false) {
      // Now, for this, we update the doc.
      // https://firebase.google.com/docs/firestore/manage-data/add-data
      setDoc(fileRef, { archived: true }, { merge: true })
        .then(() => {
          console.log('File has been archived!');
          res.status(200).send('File has been archived!');
        }).catch((error) => {
          console.error('Error archiving file:', error);
          res.status(500).send('Error archiving file');
        });
    } else {
      //https://firebase.google.com/docs/storage/web/delete-files
      deleteObject(storageRef).then(() => {
        console.log('File deleted from storage!');

        // File deletion for Firestore
        //https://firebase.google.com/docs/firestore/manage-data/delete-data
        deleteDoc(fileRef).then(() => {
          console.log('File has officially been deleted!');
          res.status(200).send('File has officially been deleted!');
        }).catch((error) => {
          console.error('Error deleting file:', error);
          res.status(500).send('Error deleting file');
        });
      }).catch((error) => {
        console.error('Error deleting file from storage:', error);
        res.status(500).send('Error deleting file from storage');
      });
    }
  });

  //Restore call, used to restore a file from the trash
  app.get('/restore', async (req, res) => {
    const { user, filename } = req.query;
    const fileRef = doc(db, 'files/users/' + user, filename);

    // Now, for this, we update the doc.
    // https://firebase.google.com/docs/firestore/manage-data/add-data
    setDoc(fileRef, { archived: false }, { merge: true })
      .then(() => {
        console.log('File has been restored!');
        res.status(200).send('File has been restored!');
      }).catch((error) => {
        console.error('Error archiving file:', error);
        res.status(500).send('Error archiving file');
      });
  });

  //Logout call, used to sign out the user
  app.post('/logout', (req, res) => {
    // If logged in, sign out the user, else throw error
    signOut(auth).then(() => {
      console.log('User signed out successfully!');
      res.status(200).send('User logged out successfully');
    }).catch((error) => {
      console.error('Error signing out user:', error);
      res.status(400).send('Error logging out user');
    });
  });

  // Simple test route
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
