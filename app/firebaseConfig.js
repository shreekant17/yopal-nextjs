// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqc19ApLqdbFrd48Q79pW9HUqUJ5PKfnw",
    authDomain: "yplexity.firebaseapp.com",
    projectId: "yplexity",
    storageBucket: "yplexity.firebasestorage.app",
    messagingSenderId: "1055821084886",
    appId: "1:1055821084886:web:799e20bca12fa38fd1f177"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };