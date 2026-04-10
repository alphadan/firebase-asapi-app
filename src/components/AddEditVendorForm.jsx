import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const AddEditVendorForm = ({
  handleAddDocument,
  handleSetDocument,
  handleDeleteDocument,
  initialItem,
  onCancel,
  onSave,
}) => {
  const isEdit = !!initialItem?.key;

  const [form, setForm] = useState(
    initialItem || {
      vendorname: "",
      vendorcode: "",
      vendoraddress: "",
      vendorcity: "",
      vendorstate: "",
      vendorzipcode: "",
      vendorphone: "",
      ...initialItem,
    }
  );

  useEffect(() => {
    if (initialItem && !initialItem.key) {
      setForm({
        vendorname: "",
        vendorcode: "",
        vendoraddress: "",
        vendorcity: "",
        vendorstate: "",
        vendorzipcode: "",
        vendorphone: "",
      });
    }
  }, [initialItem]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("vendors", initialItem.key, form);
      } else {
        await handleAddDocument("vendors", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="vendorname"
              label="Company Name"
              value={form.vendorname}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="vendorcode"
              label="Code"
              value={form.vendorcode}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="vendorphone"
              label="Phone"
              value={form.vendorphone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="vendoraddress"
              label="Address"
              value={form.vendoraddress}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="vendorcity"
              label="City"
              value={form.vendorcity}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="vendorstate"
              label="State"
              value={form.vendorstate}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="vendorzipcode"
              label="Zip"
              value={form.vendorzipcode}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditVendorForm;
