// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADUOk-Z3iOYLQG1wkujfDD8FtxWBDfZ7A",
  authDomain: "gather-f0ca8.firebaseapp.com",
  databaseURL: "https://gather-f0ca8-default-rtdb.firebaseio.com",
  projectId: "gather-f0ca8",
  storageBucket: "gather-f0ca8.appspot.com",
  messagingSenderId: "355309946566",
  appId: "1:355309946566:web:29a40e978651aae209b9c7",
  measurementId: "G-49K2HZH2VL",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const storage = getStorage(app);
