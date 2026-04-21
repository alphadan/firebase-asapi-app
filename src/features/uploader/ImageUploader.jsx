import React, { useState, useEffect, useRef } from "react";
import { Button, Box, Typography } from "@mui/material";

const ImageUploader = ({ onFileSelect, resetSignal }) => {
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const prevResetSignal = useRef(0); // Track previous resetSignal value

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "image/gif",
  ];
  const maxSize = 1 * 1024 * 1024; // 1MB in bytes

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError("");

    if (!file) {
      onFileSelect(null);
      return;
    }

    if (file.size > maxSize) {
      setError("File size exceeds 1MB limit.");
      onFileSelect(null);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, PDF, and GIF files are accepted.");
      onFileSelect(null);
      return;
    }

    console.log("New file selected:", file.name);
    onFileSelect(file);
  };

  useEffect(() => {
    // Only reset if resetSignal has changed
    if (resetSignal !== prevResetSignal.current && resetSignal > 0) {
      console.log("Reset signal received:", resetSignal);
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear file input
      }
      onFileSelect(null); // Clear selected file
      prevResetSignal.current = resetSignal; // Update previous value
    }
  }, [resetSignal, onFileSelect]);

  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Button variant="outlined" component="label" sx={{ mb: 1 }}>
        Upload Image
        <input
          type="file"
          hidden
          accept=".jpg,.jpeg,.png,.pdf,.gif"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </Button>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        Only JPG, PNG, PDF, and GIF files up to 1MB are accepted.
      </Typography>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploader;
