import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const AddEditNewsPostForm = ({
  handleAddDocument,
  handleSetDocument,
  initialItem,
  onCancel,
  onSave,
}) => {
  const isEdit = !!initialItem?.key;

  const [form, setForm] = useState(
    initialItem || {
      newsid: "",
      newsindex: "",
      newscontent: "",
      newsheading: "",
      newssummary: "",
      newsdate: new Date().toISOString().split("T")[0],
      newsphotourl: "",
      newsphotothumb: "",
      newscategoryid: "",
    },
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("newsposts", initialItem.key, form);
      } else {
        await handleAddDocument("newsposts", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle fontWeight="bold">
        {isEdit ? "Edit News Post" : "Add New News Post"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              name="newsheading"
              label="Heading / Title"
              value={form.newsheading}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="newsdate"
              label="Date"
              type="date"
              value={form.newsdate}
              onChange={handleChange}
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="newssummary"
              label="Summary"
              value={form.newssummary}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="newscontent"
              label="Content"
              value={form.newscontent}
              onChange={handleChange}
              fullWidth
              multiline
              rows={6}
              required
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField
              name="newsid"
              label="News ID"
              value={form.newsid}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField
              name="newsindex"
              label="Index Order"
              type="number"
              value={form.newsindex}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="newscategoryid"
              label="Category ID"
              value={form.newscategoryid}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="newsphotourl"
              label="Photo URL"
              value={form.newsphotourl}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="newsphotothumb"
              label="Photo Thumbnail URL"
              value={form.newsphotothumb}
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
          {isEdit ? "Update Post" : "Save Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditNewsPostForm;
