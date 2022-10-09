import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAn6cm8cXGWS4z_VwkVLFKinAN5_oBFshU",
  authDomain: "fir-asapi.firebaseapp.com",
  projectId: "fir-asapi",
  storageBucket: "fir-asapi.appspot.com",
  messagingSenderId: "114853796331",
  appId: "1:114853796331:web:47a73bac0c42c606e1a1ae",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
