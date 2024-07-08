import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjYOyP2gH2Cen-NDq9JR4MpLfPaOofE_k",
  authDomain: "shopease-6e338.firebaseapp.com",
  projectId: "shopease-6e338",
  storageBucket: "shopease-6e338.appspot.com",
  messagingSenderId: "69148097591",
  appId: "1:69148097591:web:efd337b035e14f49f993b2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
export { app, auth,db };
