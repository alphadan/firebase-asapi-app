import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
} from "@mui/material";

const AddEditReviewStatsForm = ({
  handleAddDocument,
  handleSetDocument,
  initialItem,
  onCancel,
  onSave,
}) => {
  const isEdit = !!initialItem?.key;

  const [form, setForm] = useState(
    initialItem || {
      reviewstatsid: "",
      total_reviews: 0,
      total_reviews_formatted: "",
      reviewscount: 0,
      lastmerchantreviewid: "",
      lastupdated: new Date().toISOString().split("T")[0],
      total_google_eligible: 0,
      average_rating: 0,
      fivestar: 0,
      fourstar: 0,
      threestar: 0,
      twostar: 0,
      onestar: 0,
    },
  );

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Convert to number if the field is numeric
    const finalValue = type === "number" ? Number(value) : value;
    setForm({ ...form, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("reviewstats", initialItem.key, form);
      } else {
        await handleAddDocument("reviewstats", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle fontWeight="bold">
        {isEdit ? "Edit Review Statistics" : "Add Review Statistics"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Header Info */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="reviewstatsid"
              label="Stats ID"
              value={form.reviewstatsid}
              onChange={handleChange}
              fullWidth
              required
              disabled={isEdit}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="lastupdated"
              label="Last Updated"
              type="date"
              value={form.lastupdated}
              onChange={handleChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">
              AGGREGATE TOTALS
            </Typography>
            <Divider sx={{ mb: 1 }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="total_reviews"
              label="Total Reviews (All)"
              type="number"
              value={form.total_reviews}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="total_reviews_formatted"
              label="Total Reviews (Formatted)"
              value={form.total_reviews_formatted}
              onChange={handleChange}
              fullWidth
              placeholder="e.g. 10,000+"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="total_google_eligible"
              label="Google Eligible"
              type="number"
              value={form.total_google_eligible}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="average_rating"
              label="Average Rating"
              type="number"
              slotProps={{ htmlInput: { step: "0.1" } }}
              value={form.average_rating}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="reviewscount"
              label="Database Review Count"
              type="number"
              value={form.reviewscount}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">
              STAR DISTRIBUTION
            </Typography>
            <Divider sx={{ mb: 1 }} />
          </Grid>

          {/* Star Ratings Row */}
          {["fivestar", "fourstar", "threestar", "twostar", "onestar"].map(
            (star) => (
              <Grid size={{ xs: 4, sm: 2.4 }} key={star}>
                <TextField
                  name={star}
                  label={star.replace("star", " Star").toUpperCase()}
                  type="number"
                  value={form[star]}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
            ),
          )}

          <Grid size={12}>
            <TextField
              name="lastmerchantreviewid"
              label="Last Merchant Review ID"
              value={form.lastmerchantreviewid}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? "Update Stats" : "Save Stats"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditReviewStatsForm;
