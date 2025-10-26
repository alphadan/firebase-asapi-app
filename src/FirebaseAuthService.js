import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./FirebaseConfig.js";

const registerUser = async (auth, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential;
};

const loginUser = async (auth, email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  console.log("Logged in user:", userCredential.user);
  return userCredential;
};

const logoutUser = (auth) => {
  signOut(auth);
};

const sendEmail = async (auth, email) => {
  console.log("Send Email:", email);
  await sendPasswordResetEmail(auth, email);
};

const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(provider);
};

const subscribeToAuthChanges = (handleAuthChange) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log("[subscribeToAuthChanges]: user =", user);
    handleAuthChange(user);
  });
  return unsubscribe;
};

const FirebaseAuthService = {
  registerUser,
  loginUser,
  logoutUser,
  sendEmail,
  loginWithGoogle,
  subscribeToAuthChanges,
};

export default FirebaseAuthService;
