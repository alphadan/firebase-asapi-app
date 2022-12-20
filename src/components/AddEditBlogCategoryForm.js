import { useState } from "react";
import FirestoreDBService from "../FirestoreDBService.js";

function AddEditBlogCategoryForm({
  handleAddDocument,
  handleSetDocument,
  handleDeleteDocument,
}) {
  const [blogid, setBlogId] = useState("");
  const [bloguri, setBlogUri] = useState("");
  const [blogcategoryid, setBlogCategoryId] = useState("");
  const [blogcategoryname, setBlogCategoryName] = useState("");
  const [blogmetadescription, setBlogMetaDescription] = useState("");
  const [blogactive, setBlogActive] = useState("");
  const [currentblogid, setCurrentBlogId] = useState("");
  const [currentbloguri, setCurrentBlogUri] = useState("");
  const [currentblogcategoryid, setCurrentBlogCategoryId] = useState("");
  const [currentblogcategoryname, setCurrentBlogCategoryName] = useState("");
  const [currentblogmetadescription, setCurrentBlogMetaDescription] =
    useState("");
  const [currentblogactive, setCurrentBlogActive] = useState("");
  const [currentblogcategorykey, setCurrentBlogCategoryKey] = useState("");

  function handleBlogCategoryFormSubmit(e) {
    e.preventDefault();
    const folder = "blogcategories";
    const formname = "addblogcategory";

    const newDocument = {
      blogid: Number(blogid),
      bloguri,
      blogcategoryid,
      blogcategoryname,
      blogmetadescription,
      blogactive,
    };

    handleAddDocument(folder, newDocument);

    resetForm(formname);
  }

  async function handleGetCurrentBlogCategory() {
    const folder = "blogcategories";
    const queries = [];
    const queryBlogCategoryId = document.getElementById("blogcategoryid").value;

    queries.push({
      field: "blogcategoryid",
      condition: "==",
      value: queryBlogCategoryId,
    });

    const querySnapshot = await FirestoreDBService.readCurrentItem(
      folder,
      queries
    );

    querySnapshot.forEach((doc) => {
      setCurrentBlogCategoryKey(doc.id);
      setCurrentBlogId(doc.get("blogid"));
      setCurrentBlogUri(doc.get("bloguri"));
      setCurrentBlogCategoryId(doc.get("blogcategoryid"));
      setCurrentBlogCategoryName(doc.get("blogcategoryname"));
      setCurrentBlogMetaDescription(doc.get("blogmetadescription"));
      setCurrentBlogActive(doc.get("blogactive"));
    });
  }

  function handleUpdateBlogCategoryFormSubmit(e) {
    e.preventDefault();
    const folder = "blogcategories";
    const setid = document.getElementById("currentblogcategorykey").value;
    const formname = "updateblogcategory";

    const newDocument = {
      blogid: currentblogid,
      bloguri: currentbloguri,
      blogcategoryid: currentblogcategoryid,
      blogcategoryname: currentblogcategoryname,
      blogmetadescription: currentblogmetadescription,
      blogactive: currentblogactive,
    };

    handleSetDocument(folder, setid, newDocument);

    resetForm(formname);
  }

  function handleEditBlogCategoryCancel() {
    const formname = "updateblogcategory";
    resetForm(formname);
  }

  function handleDeleteBlogCategorySubmit(currentvendorid) {
    const folder = "blogcategories";
    const deleteid = document.getElementById("currentblogcategorykey").value;
    const formname = "updateblogcategory";
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
      setBlogId("");
      setBlogUri("");
      setBlogCategoryId("");
      setBlogCategoryName("");
      setBlogMetaDescription("");
      setBlogActive("");
    } else {
      setCurrentBlogId("");
      setCurrentBlogUri("");
      setCurrentBlogCategoryId("");
      setCurrentBlogCategoryName("");
      setCurrentBlogMetaDescription("");
      setCurrentBlogActive("");
    }
  }

  return (
    <div className="main">
      <div className="center">
        <div className="recipe-list-box">
          <div className="recipe-list">
            <div className="recipe-card">
              <form
                onSubmit={handleBlogCategoryFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Add New Blog Category</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Blog ID:
                      <input
                        type="text"
                        required
                        value={blogid}
                        onChange={(e) => setBlogId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Blog Uri:
                      <input
                        type="text"
                        required
                        value={bloguri}
                        onChange={(e) => setBlogUri(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Blog Category Id:
                      <input
                        type="text"
                        required
                        value={blogcategoryid}
                        onChange={(e) => setBlogCategoryId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Blog Category Name:
                      <input
                        type="text"
                        required
                        value={blogcategoryname}
                        onChange={(e) => setBlogCategoryName(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Blog Meta Description:
                      <input
                        type="text"
                        required
                        value={blogmetadescription}
                        onChange={(e) => setBlogMetaDescription(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Blog Active:
                      <input
                        type="text"
                        required
                        value={blogactive}
                        onChange={(e) => setBlogActive(e.target.value)}
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
                    Add Blog Category
                  </button>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form className="add-edit-recipe-form-container">
                <h2>Search Blog Cateogry</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Blog Category Id:
                      <input
                        id="blogcategoryid"
                        type="text"
                        required
                        className="input-text"
                        value={currentblogcategoryid}
                        onChange={(e) =>
                          setCurrentBlogCategoryId(e.target.value)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="primary-button edit-button"
                      onClick={handleGetCurrentBlogCategory}
                    >
                      Get Blog Category
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form
                onSubmit={handleUpdateBlogCategoryFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Update Blog Category</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Blog Id:
                      <input
                        type="text"
                        required
                        readOnly
                        value={currentblogid}
                        onChange={(e) => setCurrentBlogId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Blog Uri:
                      <input
                        type="text"
                        required
                        value={currentbloguri}
                        onChange={(e) => setCurrentBlogUri(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Blog Category Id:
                      <input
                        type="text"
                        required
                        value={currentblogcategoryid}
                        onChange={(e) =>
                          setCurrentBlogCategoryId(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Blog Category Name:
                      <input
                        type="text"
                        required
                        value={currentblogcategoryname}
                        onChange={(e) =>
                          setCurrentBlogCategoryName(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Blog Meta Description:
                      <input
                        type="text"
                        required
                        value={currentblogmetadescription}
                        onChange={(e) =>
                          setCurrentBlogMetaDescription(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Blog Active:
                      <input
                        type="text"
                        required
                        value={currentblogactive}
                        onChange={(e) => setCurrentBlogActive(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Key:
                      <input
                        type="text"
                        id="currentblogcategorykey"
                        required
                        readOnly
                        value={currentblogcategorykey}
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
                      onClick={handleEditBlogCategoryCancel}
                      className="primary-button action-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteBlogCategorySubmit}
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

export default AddEditBlogCategoryForm;
