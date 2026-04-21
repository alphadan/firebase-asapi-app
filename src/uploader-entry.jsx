import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import UploaderWidget from "./features/uploader/UploaderWidget";
import { auth } from "./FirebaseConfig";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import "./index.css";

// This ID should match the div on your website
const container = document.getElementById("image-submission-root");

const RootComponent = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("Uploader: Signing in anonymously...");
        signInAnonymously(auth)
          .then(() => console.log("Uploader: Signed in anonymously"))
          .catch((err) =>
            console.error("Uploader: Anonymous sign-in failed:", err),
          );
      } else {
        console.log("Uploader: User already signed in:", user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <React.StrictMode>
      <UploaderWidget />
    </React.StrictMode>
  );
};

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<RootComponent />);
}
