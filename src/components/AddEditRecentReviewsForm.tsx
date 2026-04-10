import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";

const AddEditRecentReviewsForm = ({
  handleAddDocument,
  handleSetDocument,
  initialItem,
  onCancel,
  onSave,
}) => {
  const isEdit = !!initialItem?.key;

  const [form, setForm] = useState({
    reviewheadline: "",
    reviewoverallrating: 5,
    reviewcomments: "",
    reviewnickname: "",
    reviewlocation: "",
    reviewpageid: "",
    revieworderid: "",
    reviewcreatedate: new Date().toISOString().split("T")[0],
    ...initialItem,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        // For Recent Reviews, we use the standard setDocument
        await handleSetDocument("recentreviews", initialItem.key, form);
      } else {
        await handleAddDocument("recentreviews", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle fontWeight="bold">
        {isEdit ? "Edit Recent Review" : "Add Manual Recent Review"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              name="reviewheadline"
              label="Headline"
              value={form.reviewheadline}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="reviewoverallrating"
              label="Rating"
              select
              value={form.reviewoverallrating}
              onChange={handleChange}
              fullWidth
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} Stars
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="reviewcomments"
              label="Comment"
              value={form.reviewcomments}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="reviewnickname"
              label="Reviewer Name"
              value={form.reviewnickname}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="reviewlocation"
              label="Location"
              value={form.reviewlocation}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="reviewpageid"
              label="Product ID"
              value={form.reviewpageid}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="revieworderid"
              label="Order #"
              value={form.revieworderid}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? "Update Recent Review" : "Save Recent Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditRecentReviewsForm;
