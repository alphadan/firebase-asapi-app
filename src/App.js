import { useEffect, useState } from "react";
import FirebaseAuthService from "./FirebaseAuthService.js";
import { useCollection } from "./hooks/useCollection.js";
import { COLLECTIONS, PER_PAGE } from "./utils/constants.js";
import CollectionList from "./components/CollectionList.js";
import LoginForm from "./components/LoginForm.js";
import AddEditVendorForm from "./components/AddEditVendorForm.js";
import AddEditReviewStatsForm from "./components/AddEditReviewStatsForm.js";
import AddEditShipOverrideForm from "./components/AddEditShipOverrideForm.js";
import AddEditReviewsForm from "./components/AddEditReviewsForm.js";
import AddEditBlogCategoryForm from "./components/AddEditBlogCategoryForm.js";
import AddEditBlogPostForm from "./components/AddEditBlogPostForm.js";
import AddEditNewsCategoryForm from "./components/AddEditNewsCategoryForm.js";
import AddEditNewsPostForm from "./components/AddEditNewsPostForm.js";
import FirestoreDBService from "./FirestoreDBService.js";
import "./App.css";
import companyLogo from "./images/alphabet-signs-logo-450.png";
import {
  Card,
  Grid,
  CardContent,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Alert,
  Skeleton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [folder, setFolder] = useState("vendors");
  const [reviewStatsForm, setReviewStatsForm] = useState({
    startDate: "",
    endDate: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingRecent, setIsUpdatingRecent] = useState(false);

  // ------------------------------------------------------------------
  // AUTH
  // ------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = FirebaseAuthService.subscribeToAuthChanges(setUser);
    return () => unsubscribe();
  }, []);

  // ------------------------------------------------------------------
  // DATA – useCollection hook replaces all previous fetch logic
  // ------------------------------------------------------------------
  const {
    data: list,
    loading: isLoading,
    error,
    orderByDirection,
    setOrderByDirection,
    next,
    prev,
    canPaginate,
    refetch,
  } = useCollection(folder);

  // ------------------------------------------------------------------
  // REVIEW FETCH (still in UI – will move to a service later)
  // ------------------------------------------------------------------
  const [fetchingReviews, setFetchingReviews] = useState(false);

  const handleFetchReviewsByDateRange = async (e) => {
    e.preventDefault();
    setFetchingReviews(true);
    try {
      const apiUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:5001/fir-asapi/us-central1/api/fetchAndInsertReviews"
          : "https://us-central1-fir-asapi.cloudfunctions.net/api/fetchAndInsertReviews";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: reviewStatsForm.startDate,
          to: reviewStatsForm.endDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch reviews");

      const result = await response.json();
      alert(
        `Inserted ${result.inserted} new reviews! Total: ${result.reviewscount}`
      );

      // Auto-refresh reviews list
      refetch();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setFetchingReviews(false);
    }
  };

  // ------------------------------------------------------------------
  // RECENT REVIEWS FETCH (still in UI – will move to a service later)
  // ------------------------------------------------------------------

  const handleUpdateRecentReviews = async () => {
    if (
      !window.confirm(
        "Replace all 10 recent reviews with the latest from reviews?"
      )
    )
      return;

    setIsUpdatingRecent(true);
    try {
      await FirestoreDBService.updateRecentReviews();
      alert("Recent reviews updated successfully!");
      refetch(); // Refresh the list
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsUpdatingRecent(false);
    }
  };

  // ------------------------------------------------------------------
  // CRUD HANDLERS (thin wrappers – will be moved to hook later)
  // ------------------------------------------------------------------
  const handleAddDocument = async (folder, newDoc) => {
    setIsSaving(true);
    try {
      await FirestoreDBService.createNewDocument(folder, newDoc);
      alert("Document created");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDocument = async (folder, id, doc) => {
    try {
      await FirestoreDBService.setDocument(folder, id, doc);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSetReviewDocument = async (folder, id, doc) => {
    try {
      await FirestoreDBService.updateReviewDocument(folder, id, doc);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDocument = async (folder, id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await FirestoreDBService.deleteDocument(folder, id);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------
  return (
    <ErrorBoundary>
      <div className="App">
        {/* ---------- HEADER ---------- */}
        <div className="title-row">
          <div className="logoimg">
            <img src={companyLogo} alt="logo" />
          </div>
          <LoginForm existingUser={user} />
        </div>

        {/* ---------- MAIN ---------- */}
        <div className="main">
          {/* ---- Collection Selector & Sort ---- */}
          <div className="row filters">
            <label className="recipe-label input-label">
              Collection:
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="select"
              >
                {Object.entries(COLLECTIONS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            {/* One sort dropdown – only for collections that have orderBy */}
            {COLLECTIONS[folder]?.orderBy && (
              <label className="input-label">
                <select
                  value={orderByDirection}
                  onChange={(e) => setOrderByDirection(e.target.value)}
                  className="select"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </label>
            )}
          </div>

          {/* ---- Review Stats Fetch Form ---- */}
          {user && folder === "reviewstats" && (
            <div className="fetch-reviews-form">
              <h3>Fetch Reviews by Date Range</h3>
              <form onSubmit={handleFetchReviewsByDateRange}>
                <label>
                  Start Date (YYYY-MM-DD):
                  <input
                    type="text"
                    value={reviewStatsForm.startDate}
                    onChange={(e) =>
                      setReviewStatsForm({
                        ...reviewStatsForm,
                        startDate: e.target.value,
                      })
                    }
                    placeholder="2025-01-01"
                    required
                  />
                </label>
                <label>
                  End Date (YYYY-MM-DD):
                  <input
                    type="text"
                    value={reviewStatsForm.endDate}
                    onChange={(e) =>
                      setReviewStatsForm({
                        ...reviewStatsForm,
                        endDate: e.target.value,
                      })
                    }
                    placeholder="2025-12-31"
                    required
                  />
                </label>
                <button type="submit" disabled={fetchingReviews || isLoading}>
                  {fetchingReviews ? "Fetching…" : "Fetch Reviews"}
                </button>
              </form>
            </div>
          )}

          {/* ---- CRUD Forms (unchanged for now) ---- */}
          {editingItem !== null && (
            <div className="modal-overlay" onClick={() => setEditingItem(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button
                  className="close-modal"
                  onClick={() => setEditingItem(null)}
                >
                  ×
                </button>
                {folder === "reviewstats" && (
                  <AddEditReviewStatsForm
                    initialItem={editingItem.key ? editingItem : null}
                    handleSetDocument={handleSetDocument}
                    onCancel={() => setEditingItem(null)}
                    onSave={() => {
                      setEditingItem(null);
                      refetch(); // ← Auto-refresh
                    }}
                  />
                )}
                {folder === "reviews" && (
                  <AddEditReviewsForm
                    initialItem={editingItem.key ? editingItem : null}
                    handleSetReviewDocument={handleSetReviewDocument}
                    onCancel={() => setEditingItem(null)}
                    onSave={() => {
                      setEditingItem(null);
                      refetch(); // ← Auto-refresh
                    }}
                  />
                )}
                {folder === "vendors" && (
                  <AddEditVendorForm
                    initialItem={editingItem.key ? editingItem : null}
                    handleSetDocument={handleSetDocument}
                    onCancel={() => setEditingItem(null)}
                    onSave={() => {
                      setEditingItem(null);
                      refetch(); // ← Auto-refresh
                    }}
                  />
                )}
                {folder === "blogcategories" && (
                  <AddEditBlogCategoryForm
                    initialItem={editingItem.key ? editingItem : null}
                    handleSetDocument={handleSetDocument}
                    onCancel={() => setEditingItem(null)}
                    onSave={() => {
                      setEditingItem(null);
                      refetch(); // ← Auto-refresh
                    }}
                  />
                )}
                {folder === "blogposts" && (
                  <AddEditBlogPostForm
                    initialItem={editingItem.key ? editingItem : null}
                    handleSetDocument={handleSetDocument}
                    onCancel={() => setEditingItem(null)}
                    onSave={() => {
                      setEditingItem(null);
                      refetch(); // ← Auto-refresh
                    }}
                  />
                )}
                {folder === "newscategories" && (
                  <AddEditNewsCategoryForm
                    initialItem={editingItem.key ? editingItem : null}
                    handleSetDocument={handleSetDocument}
                    onCancel={() => setEditingItem(null)}
                    onSave={() => {
                      setEditingItem(null);
                      refetch(); // ← Auto-refresh
                    }}
                  />
                )}
                {folder === "newsposts" && (
                  <AddEditNewsPostForm
                    initialItem={editingItem.key ? editingItem : null}
                    handleSetDocument={handleSetDocument}
                    onCancel={() => setEditingItem(null)}
                    onSave={() => {
                      setEditingItem(null);
                      refetch(); // ← Auto-refresh
                    }}
                  />
                )}
                {folder === "shipoverride" && (
                  <AddEditShipOverrideForm
                    initialItem={editingItem.key ? editingItem : null}
                    handleSetDocument={handleSetDocument}
                    onCancel={() => setEditingItem(null)}
                    onSave={() => {
                      setEditingItem(null);
                      refetch(); // ← Auto-refresh
                    }}
                  />
                )}
                {/* Add other collections */}
                <button
                  className="close-modal"
                  onClick={() => setEditingItem(null)}
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {/* ---- LIST ---- */}
          <div className="center">
            <div className="recipe-list-box">
              {/* Loading */}
              {isLoading && (
                <div className="fire">
                  <div className="flames">
                    <div className="flame"></div>
                    <div className="flame"></div>
                    <div className="flame"></div>
                    <div className="flame"></div>
                  </div>
                  <div className="logs"></div>
                </div>
              )}

              {/* Error */}
              {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

              {/* Empty */}
              {!isLoading && list.length === 0 && (
                <h5 className="no-recipes">No items found</h5>
              )}

              {/* ---- LIST ---- */}
              <div className="center">
                <div className="recipe-list-box">
                  {/* Loading Skeleton */}
                  {isLoading && (
                    <Grid container spacing={3}>
                      {[...Array(PER_PAGE)].map((_, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                          <Card>
                            <CardContent>
                              <Box sx={{ pt: 1 }}>
                                <Skeleton
                                  variant="text"
                                  width="80%"
                                  height={32}
                                  sx={{ mb: 2 }}
                                />
                                {[...Array(4)].map((_, j) => (
                                  <Box
                                    key={j}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      py: 0.5,
                                    }}
                                  >
                                    <Skeleton
                                      variant="text"
                                      width="40%"
                                      height={24}
                                    />
                                    <Skeleton
                                      variant="text"
                                      width="50%"
                                      height={24}
                                    />
                                  </Box>
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {error && (
                    <p style={{ color: "red" }}>Error: {error.message}</p>
                  )}

                  {/* ---- ADD NEW BUTTON ---- */}
                  {folder !== "recentreviews" && (
                    <div className="add-new-container">
                      <button
                        className="primary-button add-new-btn"
                        onClick={() => setEditingItem({})}
                        disabled={isLoading}
                      >
                        Add New {COLLECTIONS[folder]?.label || "Item"}
                      </button>
                    </div>
                  )}

                  {/* ---- UPDATE RECENT REVIEWS BUTTON (SAME STYLE) ---- */}
                  {folder === "recentreviews" && (
                    <div className="add-new-container">
                      <button
                        className="primary-button add-new-btn"
                        onClick={handleUpdateRecentReviews}
                        disabled={isUpdatingRecent || isLoading}
                        style={{
                          backgroundColor: isUpdatingRecent ? "#ccc" : "",
                          cursor: isUpdatingRecent ? "not-allowed" : "pointer",
                        }}
                      >
                        {isUpdatingRecent
                          ? "Updating…"
                          : "Update Recent Reviews"}
                      </button>
                    </div>
                  )}

                  {/* ---- COLLECTION LIST ---- */}
                  <Container
                    maxWidth={false}
                    sx={{ width: "90%", mx: "auto", py: 2 }}
                  >
                    <Grid container spacing={3}>
                      {list.map((item) => (
                        <Grid item xs={12} sm={6} md={3} lg={3} key={item.key}>
                          <CollectionList
                            folder={folder}
                            data={[item]}
                            onEdit={(item) => setEditingItem(item)}
                            onDelete={(id) => handleDeleteDocument(folder, id)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Container>
                </div>
              </div>
            </div>
          </div>

          {/* ---- PAGINATION ---- */}
          {canPaginate && list.length > 0 && (
            <div className="action-buttons">
              {/* PREVIOUS */}
              <button
                className="primary-button action-button"
                onClick={prev}
                disabled={isLoading || !canPaginate}
              >
                Previous
              </button>

              {/* NEXT */}
              <button
                className="primary-button action-button"
                onClick={next}
                disabled={isLoading || list.length < PER_PAGE}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
