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

const AddEditBlogCategoryForm = ({
  handleAddDocument,
  handleSetDocument,
  initialItem,
  onCancel,
  onSave,
}) => {
  const isEdit = !!initialItem?.key;

  const [form, setForm] = useState(
    initialItem || {
      blogactive: "Yes",
      blogcategoryid: "",
      blogcategoryname: "",
      blogid: "",
      blogmetadescription: "",
      bloguri: "",
    },
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("blogcategories", initialItem.key, form);
      } else {
        await handleAddDocument("blogcategories", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight="bold">
        {isEdit ? "Edit Blog Category" : "Add New Blog Category"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              name="blogcategoryname"
              label="Category Name"
              value={form.blogcategoryname}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="blogactive"
              label="Active Status"
              select
              value={form.blogactive}
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
              name="bloguri"
              label="Category URI / Slug"
              value={form.bloguri}
              onChange={handleChange}
              fullWidth
              placeholder="e.g. signage-tips"
              required
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="blogcategoryid"
              label="Category ID"
              value={form.blogcategoryid}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="blogid"
              label="Internal Blog ID"
              value={form.blogid}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="blogmetadescription"
              label="Meta Description (SEO)"
              value={form.blogmetadescription}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
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

export default AddEditBlogCategoryForm;
