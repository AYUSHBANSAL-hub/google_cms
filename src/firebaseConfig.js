import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAdEwJ7iTYgGkY8aQVGXYa058etLwAEes8",
    authDomain: "my-cms-d81f9.firebaseapp.com",
    projectId: "my-cms-d81f9",
    storageBucket: "my-cms-d81f9.appspot.com",
    messagingSenderId: "1097591286572",
    appId: "1:1097591286572:web:ce4600abfcc95bd6e8da89",
    measurementId: "G-Q5KD6EVYJC"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };