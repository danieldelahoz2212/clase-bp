// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCpZydLQHRyNToi_jUPOPmJxkexWx_Fsz4",
    authDomain: "lista-react-bp.firebaseapp.com",
    projectId: "lista-react-bp",
    storageBucket: "lista-react-bp.appspot.com",
    messagingSenderId: "903443629985",
    appId: "1:903443629985:web:722fbc4a0a4f36b2836de0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export { db }