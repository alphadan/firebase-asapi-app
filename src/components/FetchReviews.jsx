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
} from "@mui/material";
import { useNotification } from "../context/NotificationContext";

const FetchReviews = ({ open, onClose, onRefresh }) => {
  const { showNotification } = useNotification();
  const [fetching, setFetching] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const handleFetch = async (e) => {
    e.preventDefault();
    setFetching(true);
    try {
      const response = await fetch(
        "https://us-central1-fir-asapi.cloudfunctions.net/api/fetchAndInsertReviews",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dateRange),
        },
      );
      if (!response.ok) throw new Error("Fetch failed");

      showNotification("Successfully imported reviews!", "success");
      onRefresh(); // Refresh the list
      onClose(); // Close the dialog
    } catch (err) {
      showNotification("Import failed: " + err.message, "error");
    } finally {
      setFetching(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight="bold">Fetch from ShopperApproved</DialogTitle>
      <form onSubmit={handleFetch}>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter a date range to import reviews into the database.
          </Typography>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={fetching}
          >
            {fetching ? "Importing..." : "Start Import"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FetchReviews;
