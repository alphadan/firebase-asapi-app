import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CollectionList from "../CollectionList";
import { useCollection } from "../../hooks/useCollection";
import FirestoreDBService from "../../FirestoreDBService";

// Form Imports
import AddEditVendorForm from "../AddEditVendorForm";
import AddEditReviewsForm from "../AddEditReviewsForm";

const MainContent = ({ folder }) => {
  const { data, loading, error, next, prev, canPaginate, refetch } =
    useCollection(folder);

  // State for Edit/Add
  const [editingItem, setEditingItem] = useState(null);

  // State for Delete Confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [fetchingReviews, setFetchingReviews] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [fetchingReviews, setFetchingReviews] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const handleFetchReviews = async (e) => {
    e.preventDefault();
    setFetchingReviews(true);
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
      alert("Successfully imported reviews!");
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setFetchingReviews(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id); // Open the confirm dialog
  };

  const handleConfirmDelete = async () => {
    try {
      await FirestoreDBService.deleteDocument(folder, deleteConfirmId);
      setDeleteConfirmId(null);
      refetch();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleSave = () => {
    setEditingItem(null);
    refetch();
  };

  const renderForm = () => {
    if (!editingItem) return null;
    const commonProps = {
      initialItem: editingItem.key ? editingItem : null,
      onCancel: () => setEditingItem(null),
      onSave: handleSave,
      handleSetDocument: FirestoreDBService.setDocument,
      handleAddDocument: FirestoreDBService.createNewDocument,
    };

    switch (folder) {
      case "vendors":
        return <AddEditVendorForm {...commonProps} />;
      case "reviews":
        return (
          <AddEditReviewsForm
            {...commonProps}
            handleSetReviewDocument={FirestoreDBService.updateReviewDocument}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        {folder === "reviewstats" && (
          <Paper sx={{ p: 3, mb: 4, bgcolor: "#fff" }} elevation={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Fetch Reviews from ShopperApproved
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              component="form"
              onSubmit={handleFetchReviews}
            >
              <TextField
                size="small"
                label="From (YYYY-MM-DD)"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                required
              />
              <TextField
                size="small"
                label="To (YYYY-MM-DD)"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={fetchingReviews}
              >
                {fetchingReviews ? "Fetching..." : "Fetch Reviews"}
              </Button>
            </Stack>
          </Paper>
        )}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ textTransform: "capitalize" }}
          >
            {folder}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditingItem({})}
          >
            Add New {folder.slice(0, -1)}
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message}
          </Alert>
        )}

        {loading ? (
          <Typography>Loading {folder}...</Typography>
        ) : (
          <Grid container spacing={3}>
            {data.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.key}>
                <CollectionList
                  folder={folder}
                  data={[item]}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => handleDeleteClick(item.key)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 4, justifyContent: "center" }}
        >
          <Button disabled={loading} onClick={prev}>
            Previous
          </Button>
          <Button
            disabled={!canPaginate || loading}
            onClick={next}
            variant="outlined"
          >
            Next
          </Button>
        </Stack>

        {/* Edit/Add Form Dialog */}
        {renderForm()}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={Boolean(deleteConfirmId)}
          onClose={() => setDeleteConfirmId(null)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to permanently delete this item from{" "}
              <b>{folder}</b>? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MainContent;
