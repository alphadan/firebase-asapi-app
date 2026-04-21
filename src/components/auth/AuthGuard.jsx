import React, { useState, useEffect } from "react";
import FirebaseAuthService from "../../FirebaseAuthService";
import LoginForm from "../LoginForm";
import { Box, CircularProgress, Typography } from "@mui/material";

const AuthGuard = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = FirebaseAuthService.subscribeToAuthChanges((u) => {
        console.log("Auth State Changed:", u ? "User Logged In" : "No User");
        setUser(u);
        setLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      console.error("AuthGuard Error:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Initializing ASAPI Console...</Typography>
      </Box>
    );

  if (error) return <Box sx={{ p: 4 }}>Error: {error}</Box>;

  return user && !user.isAnonymous ? (
    children
  ) : (
    <LoginForm existingUser={user} />
  );
};

export default AuthGuard;
