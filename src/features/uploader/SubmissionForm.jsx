import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { app } from "../../FirebaseConfig";

const storage = getStorage(app);
const db = getFirestore(app);

import {
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";

const SubmissionForm = ({ selectedFile, onSuccess, reset }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(newEmail && !validateEmail(newEmail));
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    if (selectedFile.type === "application/pdf") {
      setPreviewUrl(null); // No preview for PDFs
    } else {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }

    return () => {
      if (previewUrl && selectedFile?.type !== "application/pdf") {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedFile]); // Only depend on selectedFile

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatus("Please upload a valid JPG, PNG, PDF, or GIF file (max 1MB).");
      return;
    }
    if (!validateEmail(email)) {
      setStatus("Please enter a valid email address.");
      setEmailError(true);
      return;
    }

    setLoading(true);
    setStatus("Uploading...");

    try {
      // NEW: Log file details before upload
      console.log("🚀 Starting upload...");
      console.log("📁 Selected file:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: new Date(selectedFile.lastModified).toISOString(),
      });
      console.log("📧 Email in path:", email);

      const imagePath = `images/${Date.now()}-${email}`;
      console.log("📍 Generated path:", imagePath); // NEW: Log the exact path

      const storageRef = ref(storage, imagePath);
      console.log("🔗 Storage ref created:", storageRef.fullPath); // NEW: Log ref details

      console.log("⬆️ Uploading bytes to Storage...");
      await uploadBytes(storageRef, selectedFile);
      console.log("✅ Upload successful!"); // NEW: Confirm upload step

      console.log("🔗 Getting download URL...");
      const imageUrl = await getDownloadURL(storageRef);
      console.log("🌐 Download URL:", imageUrl); // NEW: Log the URL

      console.log("💾 Saving to Firestore (submissions)...");
      await addDoc(collection(db, "submissions"), {
        name,
        email,
        message,
        imagePath,
        imageUrl,
        timestamp: new Date().toISOString(),
      });
      console.log("✅ Firestore doc saved!"); // NEW: Confirm Firestore step

      setStatus("Thanks! Your submission has been received.");
      setName("");
      setEmail("");
      setMessage("");
      setEmailError(false);
      setPreviewUrl(null); // Clear preview after success
      if (onSuccess) onSuccess();
    } catch (error) {
      // ENHANCED: Log full error details
      console.error("❌ Upload failed! Full error:", error);
      console.error("❌ Error code:", error.code);
      console.error("❌ Error message:", error.message);
      console.error(
        "❌ Error details:",
        error.details || "No additional details",
      );
      console.error("❌ Request ID:", error.requestId || "N/A");
      console.error("❌ Server response:", error.serverResponse || "N/A");
      setStatus(
        `Error: ${error.message || "Upload failed. Check console for details."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    console.log("Resetting form in SubmissionForm");
    setName("");
    setEmail("");
    setMessage("");
    setStatus("");
    setEmailError(false);
    setPreviewUrl(null);
    if (reset) reset();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box>
        <Stack spacing={2}>
          {selectedFile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
              }}
            >
              {selectedFile.type === "application/pdf" ? (
                <Typography variant="body2" color="textSecondary">
                  PDF preview not available
                </Typography>
              ) : (
                previewUrl && (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Selected Preview"
                    sx={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      display: "block",
                    }}
                  />
                )
              )}
            </Box>
          )}
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            fullWidth
            error={emailError}
            helperText={
              emailError
                ? "Please enter a valid email (e.g., user@example.com)"
                : "We'll use this to contact you"
            }
          />
          <TextField
            label="Message"
            variant="outlined"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleSubmit} 
              sx={{ py: 1.5, minWidth: 120 }}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={loading}
              sx={{ py: 1.5, minWidth: 120 }}
            >
              Reset
            </Button>
          </Stack>
          {status && (
            <Typography
              variant="body2"
              color={status.includes("Error") ? "error" : "success.main"}
              sx={{ textAlign: "center" }}
            >
              {status}{" "}
              {status === "Thanks! Your submission has been received." && "🎉"}
            </Typography>
          )}
        </Stack>
      </Box>

      <Modal
        open={loading}
        aria-labelledby="uploading-modal-title"
        aria-describedby="uploading-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "white",
            borderRadius: 1,
            p: 3,
            boxShadow: 24,
          }}
        >
          <CircularProgress size={60} />
          <Typography id="uploading-modal-title" variant="h6" sx={{ mt: 2 }}>
            Uploading...
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default SubmissionForm;
