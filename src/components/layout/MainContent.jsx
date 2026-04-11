import React, { useState, useMemo } from "react";
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
  TextField,
  Paper,
  InputAdornment,
  Skeleton,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CollectionList from "../CollectionList";
import { useCollection } from "../../hooks/useCollection";
import FirestoreDBService from "../../FirestoreDBService";
import { useNotification } from "../../context/NotificationContext";
import { COLLECTIONS } from "../../utils/constants";

// Form Imports
import AddEditBlogCategoryForm from "../AddEditBlogCategoryForm";
import AddEditBlogPostForm from "../AddEditBlogPostForm";
import AddEditNewsCategoryForm from "../AddEditNewsCategoryForm";
import AddEditNewsPostForm from "../AddEditNewsPostForm";
import AddEditRecentReviewsForm from "../AddEditRecentReviewsForm";
import AddEditReviewsForm from "../AddEditReviewsForm";
import AddEditReviewStatsForm from "../AddEditReviewStatsForm";
import AddEditShipOverrideForm from "../AddEditShipOverrideForm";
import AddEditVendorForm from "../AddEditVendorForm";
import FetchReviews from "../FetchReviews";

const drawerWidth = 240;

const MainContent = ({ folder }) => {
  const { data, loading, error, next, prev, canPaginate, refetch } =
    useCollection(folder);
  const { showNotification } = useNotification();
  const [searchQuery, setSearchQuery] = useState("");

  // State for Edit/Add
  const [editingItem, setEditingItem] = useState(null);
  const canAdd = COLLECTIONS[folder]?.canAdd || false;

  // State for Delete Confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isFetchDialogOpen, setIsFetchDialogOpen] = useState(false);

  const capitalizedFolder = folder.charAt(0).toUpperCase() + folder.slice(1);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) => {
      // Search through ALL fields of the item
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase()),
      );
    });
  }, [data, searchQuery]);

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await FirestoreDBService.deleteDocument(folder, deleteConfirmId);
      setDeleteConfirmId(null);
      showNotification("Item deleted successfully", "success");
      refetch();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleSave = () => {
    setEditingItem(null);
    showNotification(`${capitalizedFolder} entry saved!`, "success");
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
      case "blogcategories":
        return <AddEditBlogCategoryForm {...commonProps} />;
      case "blogposts":
        return <AddEditBlogPostForm {...commonProps} />;
      case "newscategories":
        return <AddEditNewsCategoryForm {...commonProps} />;
      case "newsposts":
        return <AddEditNewsPostForm {...commonProps} />;
      case "recentreviews":
        return <AddEditRecentReviewsForm {...commonProps} />;
      case "reviewstats":
        return <AddEditReviewStatsForm {...commonProps} />;
      case "vendors":
        return <AddEditVendorForm {...commonProps} />;
      case "shipoverride":
        return <AddEditShipOverrideForm {...commonProps} />;
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
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: { xs: 1, md: 0 } }}>
          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ textTransform: "capitalize", lineHeight: 1.2 }}
            >
              {folder}
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                href="/"
                sx={{ fontSize: "0.75rem" }}
              >
                Dashboard
              </Link>
              <Typography
                color="text.primary"
                sx={{ fontSize: "0.75rem", textTransform: "capitalize" }}
              >
                {folder}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder={`Search ${folder}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                bgcolor: "grey.100",
                borderRadius: 1,
                minWidth: { xs: 150, md: 300 },
                display: { xs: "none", sm: "flex" },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            />
            {folder === "reviewstats" && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsFetchDialogOpen(true)}
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Fetch Reviews
              </Button>
            )}
            {canAdd && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditingItem({})}
                sx={{
                  whiteSpace: "nowrap",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                }}
              >
                Add New
              </Button>
            )}
          </Stack>
        </Toolbar>
        {/* Mobile Search Bar (Only visible on tiny screens) */}
        <Box sx={{ px: 2, pb: 1, display: { xs: "block", sm: "none" } }}>
          <TextField
            fullWidth
            size="small"
            placeholder={`Search ${folder}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              bgcolor: "grey.100",
              borderRadius: 1,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          />
        </Box>
      </AppBar>

      {/* Toolbar offset for fixed AppBar */}
      <Toolbar sx={{ mb: { xs: 8, sm: 2 } }} />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredData.length} items
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                <Card sx={{ height: "100%", borderRadius: 2 }}>
                  <CardContent>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1.5rem", mb: 1 }}
                      width="80%"
                    />
                    <Box sx={{ mt: 2 }}>
                      {[...Array(4)].map((_, j) => (
                        <Box
                          key={j}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Skeleton variant="text" width="40%" />
                          <Skeleton variant="text" width="45%" />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={30}
                      sx={{ borderRadius: 1 }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={30}
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {filteredData.map((item) => (
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

        <FetchReviews
          open={isFetchDialogOpen}
          onClose={() => setIsFetchDialogOpen(false)}
          onRefresh={refetch}
        />

        {/* Edit/Add Form Dialog */}
        {renderForm()}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={Boolean(deleteConfirmId)}
          onClose={() => setDeleteConfirmId(null)}
          slotProps={{
            paper: { sx: { borderRadius: 2 } },
          }}
        >
          <DialogTitle fontWeight="bold">Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to permanently delete this item from{" "}
              <b style={{ textTransform: "capitalize" }}>{folder}</b>? This
              action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteConfirmId(null)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
              autoFocus
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
