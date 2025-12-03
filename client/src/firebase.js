// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const apiKey = process.env.REACT_APP_API_KEY;
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "tutorsite-8d275.firebaseapp.com",
  projectId: "tutorsite-8d275",
  storageBucket: "tutorsite-8d275.appspot.com",
  messagingSenderId: "858164767574",
  appId: "1:858164767574:web:914aed3d1bdbc026ae04f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app
