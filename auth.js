// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX61nCMRQgBBgR7_z1DktSvJbGh7WUcrE",
  authDomain: "cinebuzz-98ccb.firebaseapp.com",
  projectId: "cinebuzz-98ccb",
  storageBucket: "cinebuzz-98ccb.firebasestorage.app",
  messagingSenderId: "73436323035",
  appId: "1:73436323035:web:3bdec389d7ef51e7db00fe",
  measurementId: "G-1JZ0ZM34M5"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Expose to window
window.auth = auth;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithPopup = signInWithPopup;
window.signOut = signOut;
window.provider = provider;
window.onAuthStateChanged = onAuthStateChanged;
