// src/components/AddEditSubmissionsForm.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";

const AddEditSubmissionsForm = ({
  handleSetDocument,
  initialItem,
  onCancel,
  onSave,
}) => {
  const [form, setForm] = useState({
    name: initialItem?.name || "",
    email: initialItem?.email || "",
    message: initialItem?.message || "",
    imagePath: initialItem?.imagePath || "",
    imageUrl: initialItem?.imageUrl || "",
    ...initialItem,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submissions are usually only edited/viewed, not created manually
      await handleSetDocument("submissions", initialItem.key, form);
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth shadow={4}>
      <DialogTitle sx={{ fontWeight: "bold" }}>Review Submission</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {initialItem?.imageUrl && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  textAlign: "center",
                  mb: 2,
                  bgcolor: "#f5f5f5",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  Submitted Image
                </Typography>
                <img
                  src={initialItem.imageUrl}
                  alt="Submission"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Grid>
          )}
          <Grid size={{ xs: 12 }}>
            <TextField
              name="name"
              label="User Name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="email"
              label="User Email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="message"
              label="Message"
              value={form.message}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              variant="filled"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="imagePath"
              label="imagePath"
              value={form.imagePath}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              variant="filled"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="imageUrl"
              label="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              variant="filled"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary">
              Submitted on:{" "}
              {initialItem?.timestamp
                ? new Date(initialItem.timestamp).toLocaleString()
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onCancel} color="inherit">
          Close
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditSubmissionsForm;
