// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqUUn535dkoddk2Bp-13IVMKBXnhO30v8",
  authDomain: "recently-saved-ca837.firebaseapp.com",
  projectId: "recently-saved-ca837",
  storageBucket: "recently-saved-ca837.appspot.com",
  messagingSenderId: "1026502078345",
  appId: "1:1026502078345:web:b13c6ad5cea9b73c423b58",
  measurementId: "G-H3YXRQNBX2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

