import React, { useState, useCallback, useRef, useEffect } from "react";
import { Box, Typography, Card, Fade, Button } from "@mui/material";
import ImageUploader from "./ImageUploader";
import SubmissionForm from "./SubmissionForm";
import Confetti from "react-confetti";

const UploaderWidget = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setSubmitted(false);
    setResetSignal((prev) => prev + 1);
  }, []);

  const handleSuccess = () => {
    setShowConfetti(true);
    setSubmitted(true);
    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  // Update dimensions for confetti relative to the container
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, [showConfetti]);

  return (
    <Box
      ref={containerRef}
      sx={{
        p: { xs: 1, sm: 2 },
        bgcolor: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={150}
          recycle={false}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 100 }}
        />
      )}

      <Card
        sx={{
          maxWidth: 550,
          mx: "auto",
          p: { xs: 2, sm: 4 },
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          borderRadius: 3,
          border: "1px solid #eaeaea",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 800, color: "#1a1a1a", mb: 3 }}
        >
          Image Submission Portal
        </Typography>

        {submitted ? (
          <Fade in={submitted}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="success.main" gutterBottom>
                Success! 🎉
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your artwork has been received. Our team will review it shortly.
              </Typography>
              <Button variant="outlined" color="primary" onClick={resetForm}>
                Submit Another
              </Button>
            </Box>
          </Fade>
        ) : (
          <>
            <ImageUploader
              onFileSelect={handleFileSelect}
              resetSignal={resetSignal}
            />
            <SubmissionForm
              selectedFile={selectedFile}
              onSuccess={handleSuccess}
              reset={resetForm}
            />
          </>
        )}

        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 3, color: "text.secondary", opacity: 0.6 }}
        >
          Securely powered by Alphabet Signs
        </Typography>
      </Card>
    </Box>
  );
};

export default UploaderWidget;
