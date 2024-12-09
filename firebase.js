// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAF4PLe",
    authDomain: "testsolverocr.firebaseapp.com",
    projectId: "testsolverocr",
    storageBucket: "testsolverocr.appspot.com",
    messagingSenderId: "16",
    appId: "1:16:web:eb0a1e5bce"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  const auth = getAuth(app);
  
  export { auth };
