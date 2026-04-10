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

const AddEditNewsCategoryForm = ({
  handleAddDocument,
  handleSetDocument,
  initialItem,
  onCancel,
  onSave,
}) => {
  const isEdit = !!initialItem?.key;

  const [form, setForm] = useState(
    initialItem || {
      newsactive: "Yes",
      newscategoryid: "",
      newscategoryname: "",
      newsdescription: "",
      newsid: "",
      newsindex: "0",
      newsuri: "",
    },
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("newscategories", initialItem.key, form);
      } else {
        await handleAddDocument("newscategories", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight="bold">
        {isEdit ? "Edit News Category" : "Add New News Category"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              name="newscategoryname"
              label="Category Name"
              value={form.newscategoryname}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="newsactive"
              label="Active"
              select
              value={form.newsactive}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="newsuri"
              label="Category URI / Slug"
              value={form.newsuri}
              onChange={handleChange}
              fullWidth
              placeholder="e.g. company-news"
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="newsdescription"
              label="Description"
              value={form.newsdescription}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="newscategoryid"
              label="Category ID"
              value={form.newscategoryid}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            {" "}
            {/* Fixed the <Gri> typo here */}
            <TextField
              name="newsid"
              label="News ID"
              value={form.newsid}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="newsindex"
              label="Index Order"
              type="number"
              value={form.newsindex}
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
          {isEdit ? "Update Category" : "Save Category"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditNewsCategoryForm;
