import { useState } from "react";
import FirestoreDBService from "../FirestoreDBService.js";

function AddEditNewsPostForm({
  handleAddDocument,
  handleSetDocument,
  handleDeleteDocument,
}) {
  const [newsindex, setNewsIndex] = useState("");
  const [newsid, setNewsId] = useState("");
  const [newscontent, setNewsContent] = useState("");
  const [newsheading, setNewsHeading] = useState("");
  const [newssummary, setNewsSummary] = useState("");
  const [newsdate, setNewsDate] = useState("");
  const [newsphotourl, setNewsPhotoUrl] = useState("");
  const [newsphotothumb, setNewsPhotoThumb] = useState("");
  const [newscategoryid, setNewsCategoryId] = useState("");
  const [currentnewsindex, setCurrentNewsIndex] = useState("");
  const [currentnewsid, setCurrentNewsId] = useState("");
  const [currentnewscontent, setCurrentNewsContent] = useState("");
  const [currentnewsheading, setCurrentNewsHeading] = useState("");
  const [currentnewssummary, setCurrentNewsSummary] = useState("");
  const [currentnewsdate, setCurrentNewsDate] = useState("");
  const [currentnewsphotourl, setCurrentNewsPhotoUrl] = useState("");
  const [currentnewsphotothumb, setCurrentNewsPhotoThumb] = useState("");
  const [currentnewscategoryid, setCurrentNewsCategoryId] = useState("");
  const [currentnewskey, setCurrentNewsKey] = useState("");

  function handleNewsPostFormSubmit(e) {
    e.preventDefault();
    const folder = "newsposts";
    const formname = "addnewsposts";

    const newDocument = {
      newsid,
      newsindex: Number(newsindex),
      newscontent,
      newsheading,
      newssummary,
      newsdate,
      newsphotourl,
      newsphotothumb,
      newscategoryid,
    };

    handleAddDocument(folder, newDocument);

    resetForm(formname);
  }

  async function handleGetCurrentNewsPost() {
    const folder = "newsposts";
    const queries = [];
    const queryNewsPostId = document.getElementById("newspostid").value;

    queries.push({
      field: "newsindex",
      condition: "==",
      value: Number(queryNewsPostId),
    });

    const querySnapshot = await FirestoreDBService.readCurrentItem(
      folder,
      queries
    );

    querySnapshot.forEach((doc) => {
      setCurrentNewsKey(doc.id);
      setCurrentNewsId(doc.get("newsid"));
      setCurrentNewsIndex(doc.get("newsindex"));
      setCurrentNewsContent(doc.get("newscontent"));
      setCurrentNewsHeading(doc.get("newsheading"));
      setCurrentNewsSummary(doc.get("newssummary"));
      setCurrentNewsDate(doc.get("newsdate"));
      setCurrentNewsPhotoUrl(doc.get("newsphotourl"));
      setCurrentNewsPhotoThumb(doc.get("newsphotothumb"));
      setCurrentNewsCategoryId(doc.get("newscategoryid"));
    });
  }

  function handleUpdateNewsPostFormSubmit(e) {
    e.preventDefault();
    const folder = "newsposts";
    const setid = document.getElementById("currentnewspostkey").value;
    const formname = "updatenewspost";

    const newDocument = {
      newsid: currentnewsid,
      newsindex: Number(currentnewsindex),
      newscontent: currentnewscontent,
      newsheading: currentnewsheading,
      newssummary: currentnewssummary,
      newsdate: currentnewsdate,
      newsphotourl: currentnewsphotourl,
      newsphotothumb: currentnewsphotothumb,
      newscategoryid: currentnewscategoryid,
    };

    handleSetDocument(folder, setid, newDocument);

    resetForm(formname);
  }

  function handleEditNewsPostCancel() {
    const formname = "updatenewspost";
    resetForm(formname);
  }

  function handleDeleteNewsPostSubmit(currentvendorid) {
    const folder = "newsposts";
    const deleteid = document.getElementById("currentnewspostkey").value;
    const formname = "updatenewspost";

    const deleteConfirmation = window.confirm("do you wish to delete?");

    if (deleteConfirmation === true) {
      try {
        handleDeleteDocument(folder, deleteid);
        resetForm(formname);
      } catch (error) {
        console.error(error.message);
        throw error;
      }
    }
  }

  function resetForm(formname) {
    if (formname === "addblogpost") {
      setNewsId("");
      setNewsIndex("");
      setNewsContent("");
      setNewsHeading("");
      setNewsSummary("");
      setNewsDate("");
      setNewsPhotoUrl("");
      setNewsPhotoThumb("");
      setNewsCategoryId("");
    } else {
      setCurrentNewsId("");
      setCurrentNewsIndex("");
      setCurrentNewsContent("");
      setCurrentNewsHeading("");
      setCurrentNewsSummary("");
      setCurrentNewsDate("");
      setCurrentNewsPhotoUrl("");
      setCurrentNewsPhotoThumb("");
      setCurrentNewsCategoryId("");
    }
  }

  return (
    <div className="main">
      <div className="center">
        <div className="recipe-list-box">
          <div className="recipe-list hidden">
            <div className="recipe-card">
              <form
                onSubmit={handleNewsPostFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Add News Post</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      News ID:
                      <input
                        type="text"
                        required
                        value={newsid}
                        onChange={(e) => setNewsId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Index:
                      <input
                        type="text"
                        required
                        value={newsindex}
                        onChange={(e) => setNewsIndex(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Content:
                      <input
                        type="text"
                        required
                        value={newscontent}
                        onChange={(e) => setNewsContent(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Heading:
                      <input
                        type="text"
                        required
                        value={newsheading}
                        onChange={(e) => setNewsHeading(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Summary:
                      <input
                        type="text"
                        required
                        value={newssummary}
                        onChange={(e) => setNewsSummary(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Date:
                      <input
                        type="text"
                        required
                        value={newsdate}
                        onChange={(e) => setNewsDate(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News PhotoUrl:
                      <input
                        type="text"
                        required
                        value={newsphotourl}
                        onChange={(e) => setNewsPhotoUrl(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Photo Thumb:
                      <input
                        type="text"
                        required
                        value={newsphotothumb}
                        onChange={(e) => setNewsPhotoThumb(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Category Id:
                      <input
                        type="text"
                        required
                        value={newscategoryid}
                        onChange={(e) => setNewsCategoryId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                  </div>
                </div>
                <div className="action-buttons">
                  <button
                    type="submit"
                    className="primary-button action-button"
                  >
                    Add News Post
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="recipe-list">
            <div className="recipe-card">
              <form className="add-edit-recipe-form-container">
                <h2>Search News Post</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      News Post Id:
                      <input
                        id="newspostid"
                        type="text"
                        required
                        className="input-text"
                        value={currentnewsid}
                        onChange={(e) => setCurrentNewsId(e.target.value)}
                      />
                    </label>

                    <button
                      type="button"
                      className="primary-button edit-button"
                      onClick={handleGetCurrentNewsPost}
                    >
                      Get News Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="recipe-list">
            <div className="recipe-card">
              <form
                onSubmit={handleUpdateNewsPostFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Update News Post</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      News Id:
                      <input
                        type="text"
                        required
                        readOnly
                        value={currentnewsid}
                        onChange={(e) => setCurrentNewsId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Index:
                      <input
                        type="text"
                        required
                        value={currentnewsindex}
                        onChange={(e) => setCurrentNewsIndex(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Category Id:
                      <input
                        type="text"
                        required
                        value={currentnewscategoryid}
                        onChange={(e) =>
                          setCurrentNewsCategoryId(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Content:
                      <textarea
                        rows="10"
                        required
                        value={currentnewscontent}
                        onChange={(e) => setCurrentNewsContent(e.target.value)}
                      ></textarea>
                    </label>
                    <label className="recipe-label input-label">
                      News Heading:
                      <input
                        type="text"
                        required
                        value={currentnewsheading}
                        onChange={(e) => setCurrentNewsHeading(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Summary:
                      <input
                        type="text"
                        required
                        value={currentnewssummary}
                        onChange={(e) => setCurrentNewsSummary(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <div className="hidden">
                      <label className="recipe-label input-label">
                        News Date:
                        <input
                          type="text"
                          required
                          value={currentnewsdate}
                          onChange={(e) => setCurrentNewsDate(e.target.value)}
                          className="input-text"
                        />
                      </label>
                      <label className="recipe-label input-label">
                        News PhotoUrl:
                        <input
                          type="text"
                          value={currentnewsphotourl}
                          onChange={(e) =>
                            setCurrentNewsPhotoUrl(e.target.value)
                          }
                          className="input-text"
                        />
                      </label>
                      <label className="recipe-label input-label">
                        News Photo Thumb:
                        <input
                          type="text"
                          value={currentnewsphotothumb}
                          onChange={(e) =>
                            setCurrentNewsPhotoThumb(e.target.value)
                          }
                          className="input-text"
                        />
                      </label>
                      <label className="recipe-label input-label">
                        Key:
                        <input
                          type="text"
                          id="currentnewspostkey"
                          required
                          readOnly
                          value={currentnewskey}
                          className="input-text"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button
                    type="submit"
                    className="primary-button action-button"
                  >
                    Update
                  </button>

                  <>
                    <button
                      type="button"
                      onClick={handleEditNewsPostCancel}
                      className="primary-button action-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteNewsPostSubmit}
                      className="primary-button action-button"
                    >
                      Delete
                    </button>
                  </>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditNewsPostForm;
