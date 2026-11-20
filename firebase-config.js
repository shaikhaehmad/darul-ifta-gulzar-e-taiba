import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5a0HGsYL1Iyr_QWyu8lVlzJb3UgTQDRI",
  authDomain: "darul-ifta-gulzar-e-taib-6ce42.firebaseapp.com",
  projectId: "darul-ifta-gulzar-e-taib-6ce42",
  storageBucket: "darul-ifta-gulzar-e-taib-6ce42.firebasestorage.app",
  messagingSenderId: "168755110227",
  appId: "1:168755110227:web:24aa685f24df3f5e1781a6",
  measurementId: "G-WPV02L7MKY"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
