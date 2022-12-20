import { useState } from "react";
import FirestoreDBService from "../FirestoreDBService.js";

function AddEditNewsCategoryForm({
  handleAddDocument,
  handleSetDocument,
  handleDeleteDocument,
}) {
  const [newsindex, setNewsIndex] = useState("");
  const [newsuri, setNewsUri] = useState("");
  const [newsactive, setNewsActive] = useState("");
  const [newscategoryname, setNewsCategoryName] = useState("");
  const [newsmetadescription, setNewsMetaDescription] = useState("");
  const [newscategoryid, setNewsCategoryId] = useState("");
  const [currentnewsindex, setCurrentNewsIndex] = useState("");
  const [currentnewsuri, setCurrentNewsUri] = useState("");
  const [currentnewsactive, setCurrentNewsActive] = useState("");
  const [currentnewscategoryname, setCurrentNewsCategoryName] = useState("");
  const [currentnewsmetadescription, setCurrentNewsMetaDescription] =
    useState("");
  const [currentnewscategoryid, setCurrentNewsCategoryId] = useState("");
  const [currentnewscategorykey, setCurrentNewsCategoryKey] = useState("");

  function handleNewsCategoryFormSubmit(e) {
    e.preventDefault();
    const folder = "newscategories";
    const formname = "addnewscategory";

    const newDocument = {
      newsindex: Number(newsindex),
      newsuri,
      newscategoryid,
      newscategoryname,
      newsmetadescription,
      newsactive,
    };

    handleAddDocument(folder, newDocument);

    resetForm(formname);
  }

  async function handleGetCurrentNewsCategory() {
    const folder = "newscategories";
    const queries = [];
    const queryNewsCategoryId = document.getElementById("newscategoryid").value;

    queries.push({
      field: "newscategoryid",
      condition: "==",
      value: queryNewsCategoryId,
    });

    const querySnapshot = await FirestoreDBService.readCurrentItem(
      folder,
      queries
    );

    querySnapshot.forEach((doc) => {
      setCurrentNewsCategoryKey(doc.id);
      setCurrentNewsIndex(doc.get("newsindex"));
      setCurrentNewsUri(doc.get("newsuri"));
      setCurrentNewsCategoryId(doc.get("newscategoryid"));
      setCurrentNewsCategoryName(doc.get("newscategoryname"));
      setCurrentNewsMetaDescription(doc.get("newsmetadescription"));
      setCurrentNewsActive(doc.get("newsactive"));
    });
  }

  function handleUpdateNewsCategoryFormSubmit(e) {
    e.preventDefault();
    const folder = "newscategories";
    const setid = document.getElementById("currentnewscategorykey").value;
    const formname = "updatenewscategory";

    const newDocument = {
      blogid: currentnewsindex,
      bloguri: currentnewsuri,
      blogcategoryid: currentnewscategoryid,
      blogcategoryname: currentnewscategoryname,
      blogmetadescription: currentnewsmetadescription,
      blogactive: currentnewsactive,
    };

    handleSetDocument(folder, setid, newDocument);

    resetForm(formname);
  }

  function handleEditNewsCategoryCancel() {
    const formname = "updatenewscategory";
    resetForm(formname);
  }

  function handleDeleteNewsCategorySubmit(currentvendorid) {
    const folder = "newscategories";
    const deleteid = document.getElementById("currentnewscategorykey").value;
    const formname = "updatenewscategory";
    console.log("currentblogkey", deleteid);

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
    if (formname === "addblogcategory") {
      setNewsIndex("");
      setNewsUri("");
      setNewsCategoryId("");
      setNewsCategoryName("");
      setNewsMetaDescription("");
      setNewsActive("");
    } else {
      setCurrentNewsIndex("");
      setCurrentNewsUri("");
      setCurrentNewsCategoryId("");
      setCurrentNewsCategoryName("");
      setCurrentNewsMetaDescription("");
      setCurrentNewsActive("");
    }
  }

  return (
    <div className="main">
      <div className="center">
        <div className="recipe-list-box">
          <div className="recipe-list">
            <div className="recipe-card">
              <form
                onSubmit={handleNewsCategoryFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Add New News Category</h2>
                <div className="top-form-section">
                  <div className="fields">
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
                      News Uri:
                      <input
                        type="text"
                        required
                        value={newsuri}
                        onChange={(e) => setNewsUri(e.target.value)}
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
                    <label className="recipe-label input-label">
                      News Category Name:
                      <input
                        type="text"
                        required
                        value={newscategoryname}
                        onChange={(e) => setNewsCategoryName(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Meta Description:
                      <input
                        type="text"
                        required
                        value={newsmetadescription}
                        onChange={(e) => setNewsMetaDescription(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Active:
                      <input
                        type="text"
                        required
                        value={newsactive}
                        onChange={(e) => setNewsActive(e.target.value)}
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
                    Add News Category
                  </button>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form className="add-edit-recipe-form-container">
                <h2>Search News Category</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      News Category Id:
                      <input
                        id="newscategoryid"
                        type="text"
                        required
                        className="input-text"
                        value={currentnewscategoryid}
                        onChange={(e) =>
                          setCurrentNewsCategoryId(e.target.value)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="primary-button edit-button"
                      onClick={handleGetCurrentNewsCategory}
                    >
                      Get News Category
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form
                onSubmit={handleUpdateNewsCategoryFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Update News Category</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      News Id:
                      <input
                        type="text"
                        required
                        readOnly
                        value={currentnewsindex}
                        onChange={(e) => setCurrentNewsIndex(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Uri:
                      <input
                        type="text"
                        required
                        value={currentnewsuri}
                        onChange={(e) => setCurrentNewsUri(e.target.value)}
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
                      News Category Name:
                      <input
                        type="text"
                        required
                        value={currentnewscategoryname}
                        onChange={(e) =>
                          setCurrentNewsCategoryName(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Meta Description:
                      <input
                        type="text"
                        required
                        value={currentnewsmetadescription}
                        onChange={(e) =>
                          setCurrentNewsMetaDescription(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      News Active:
                      <input
                        type="text"
                        required
                        value={currentnewsactive}
                        onChange={(e) => setCurrentNewsActive(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Key:
                      <input
                        type="text"
                        id="currentnewscategorykey"
                        required
                        readOnly
                        value={currentnewscategorykey}
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
                    Update
                  </button>

                  <>
                    <button
                      type="button"
                      onClick={handleEditNewsCategoryCancel}
                      className="primary-button action-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteNewsCategorySubmit}
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

export default AddEditNewsCategoryForm;
