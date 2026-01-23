// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX61nCMRQgBBgR7_z1DktSvJbGh7WUcrE",
  authDomain: "cinebuzz-98ccb.firebaseapp.com",
  projectId: "cinebuzz-98ccb",
  storageBucket: "cinebuzz-98ccb.firebasestorage.app",
  messagingSenderId: "73436323035",
  appId: "1:73436323035:web:3bdec389d7ef51e7db00fe",
  measurementId: "G-1JZ0ZM34M5"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); // If you need database later

// Firebase UI Config (optional)
const uiConfig = {
  signInSuccessUrl: 'index.html',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
};

// Export for use in other files
window.firebaseAuth = auth;

// Simple auth helper functions
window.authHelpers = {
  isLoggedIn: () => {
    return localStorage.getItem('cinebuzz_user') !== null;
  },
  
  getUser: () => {
    const user = localStorage.getItem('cinebuzz_user');
    return user ? JSON.parse(user) : null;
  },
  
  logout: () => {
    localStorage.removeItem('cinebuzz_user');
    window.location.href = 'index.html';
  }
};

// Initialize auth state listener
auth.onAuthStateChanged((user) => {
  if (user) {
    // Store user info in localStorage (simplified)
    const userData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL
    };
    localStorage.setItem('cinebuzz_user', JSON.stringify(userData));
  } else {
    localStorage.removeItem('cinebuzz_user');
  }
});