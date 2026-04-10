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

const AddEditShipOverrideForm = ({
  handleAddDocument,
  handleSetDocument,
  initialItem,
  onCancel,
  onSave,
}) => {
  const isEdit = !!initialItem?.key;

  const [form, setForm] = useState(
    initialItem || {
      productcode: "",
      productid: "",
      shipzone1: "",
      shipzone2: "",
      shipzone3: "",
      shipzone4: "",
      shipzone5: "",
      shipzone6: "",
      shipzone7: "",
    },
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("shipoverride", initialItem.key, form);
      } else {
        await handleAddDocument("shipoverride", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight="bold">
        {isEdit ? "Edit Ship Override" : "Add New Ship Override"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              name="productcode"
              label="Product Code"
              value={form.productcode}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="productid"
              label="Product ID"
              value={form.productid}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Shipping Zones */}
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <Grid item xs={4} sm={3} key={num}>
              <TextField
                name={`shipzone${num}`}
                label={`Zone ${num}`}
                value={form[`shipzone${num}`]}
                onChange={handleChange}
                fullWidth
                type="number"
                size="small"
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? "Update Override" : "Create Override"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditShipOverrideForm;
