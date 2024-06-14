// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "taskmanage-69eb2.firebaseapp.com",
  projectId: "taskmanage-69eb2",
  storageBucket: "taskmanage-69eb2.appspot.com",
  messagingSenderId: "100321775088",
  appId: "1:100321775088:web:69b7b451e122ade51ca135"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };