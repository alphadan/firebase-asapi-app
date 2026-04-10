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

const AddEditBlogPostForm = ({
  handleAddDocument,
  handleSetDocument,
  initialItem,
  onCancel,
  onSave,
}) => {
  const isEdit = !!initialItem?.key;

  const [form, setForm] = useState(
    initialItem || {
      postid: "",
      postindex: "",
      posturi: "",
      posttitle: "",
      postcontent: "",
      postsummary: "",
      postthumbnail: "",
      postproductcode: "",
      postcategorycode: "",
      postdate: new Date().toLocaleDateString("en-US"),
      postiso8601: new Date().toISOString(),
    },
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("blogposts", initialItem.key, form);
      } else {
        await handleAddDocument("blogposts", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle fontWeight="bold">
        {isEdit ? "Edit Blog Post" : "Add New Blog Post"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 9 }}>
            <TextField
              name="posttitle"
              label="Post Title"
              value={form.posttitle}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              name="postdate"
              label="Display Date"
              value={form.postdate}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="postsummary"
              label="Summary / Excerpt"
              value={form.postsummary}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="postcontent"
              label="Post Content (HTML or Text)"
              value={form.postcontent}
              onChange={handleChange}
              fullWidth
              multiline
              rows={8}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="posturi"
              label="URL Slug (URI)"
              value={form.posturi}
              onChange={handleChange}
              fullWidth
              required
              placeholder="e.g. my-new-blog-post"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="postthumbnail"
              label="Thumbnail Image URL"
              value={form.postthumbnail}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              name="postid"
              label="Post ID"
              value={form.postid}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              name="postindex"
              label="Index Order"
              type="number"
              value={form.postindex}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              name="postproductcode"
              label="Product Code"
              value={form.postproductcode}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              name="postcategorycode"
              label="Category Code"
              value={form.postcategorycode}
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

export default AddEditBlogPostForm;
