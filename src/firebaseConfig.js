import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbr5nxYWLNxFcLyvALZmHni-qEuEqo58M",
  authDomain: "tsm-ecf9e.firebaseapp.com",
  databaseURL: "https://tsm-ecf9e-default-rtdb.firebaseio.com",
  projectId: "tsm-ecf9e",
  storageBucket: "tsm-ecf9e.appspot.com",
  messagingSenderId: "171876641932",
  appId: "1:171876641932:web:c1fb764837eec0ecb51fa9",
  measurementId: "G-5QPPJSQYCV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };