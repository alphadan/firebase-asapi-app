import { useState } from "react";
import FirestoreDBService from "../FirestoreDBService.js";

function AddEditBlogPostForm({
  handleAddDocument,
  handleSetDocument,
  handleDeleteDocument,
}) {
  const [postid, setPostId] = useState("");
  const [postindex, setPostIndex] = useState("");
  const [posturi, setPostUri] = useState("");
  const [posttitle, setPostTitle] = useState("");
  const [postcontent, setPostContent] = useState("");
  const [postsummary, setPostSummary] = useState("");
  const [postthumbnail, setPostThumbnail] = useState("");
  const [postproductcode, setPostProductCode] = useState("");
  const [postcategorycode, setPostCategoryCode] = useState("");
  const [postdate, setPostDate] = useState("");
  const [postiso8601, setPostIso8601] = useState("");
  const [currentpostid, setCurrentPostId] = useState("");
  const [currentpostindex, setCurrentPostIndex] = useState("");
  const [currentposturi, setCurrentPostUri] = useState("");
  const [currentposttitle, setCurrentPostTitle] = useState("");
  const [currentpostcontent, setCurrentPostContent] = useState("");
  const [currentpostsummary, setCurrentPostSummary] = useState("");
  const [currentpostthumbnail, setCurrentPostThumbnail] = useState("");
  const [currentpostproductcode, setCurrentPostProductCode] = useState("");
  const [currentpostcategorycode, setCurrentPostCategoryCode] = useState("");
  const [currentpostdate, setCurrentPostDate] = useState("");
  const [currentpostiso8601, setCurrentPostIso8601] = useState("");
  const [currentpostkey, setCurrentPostKey] = useState("");

  function handleBlogPostFormSubmit(e) {
    e.preventDefault();
    const folder = "blogposts";
    const formname = "addblogposts";

    const newDocument = {
      postid: Number(postid),
      postindex: Number(postid),
      posturi,
      posttitle,
      postcontent,
      postsummary,
      postthumbnail,
      postproductcode,
      postcategorycode,
      postdate,
      postiso8601,
    };

    handleAddDocument(folder, newDocument);

    resetForm(formname);
  }

  async function handleGetCurrentBlogPost() {
    const folder = "blogposts";
    const queries = [];
    const queryBlogPostId = document.getElementById("blogpostid").value;

    queries.push({
      field: "postid",
      condition: "==",
      value: queryBlogPostId,
    });

    const querySnapshot = await FirestoreDBService.readCurrentItem(
      folder,
      queries
    );

    querySnapshot.forEach((doc) => {
      setCurrentPostKey(doc.id);
      setCurrentPostId(doc.get("postid"));
      setCurrentPostIndex(doc.get("postindex"));
      setCurrentPostUri(doc.get("posturi"));
      setCurrentPostTitle(doc.get("posttitle"));
      setCurrentPostContent(doc.get("postcontent"));
      setCurrentPostSummary(doc.get("postsummary"));
      setCurrentPostThumbnail(doc.get("postthumbnail"));
      setCurrentPostProductCode(doc.get("postproductcode"));
      setCurrentPostCategoryCode(doc.get("postcategorycode"));
      setCurrentPostDate(doc.get("postdate"));
      setCurrentPostIso8601(doc.get("postiso8601"));
    });
  }

  function handleUpdateBlogPostFormSubmit(e) {
    e.preventDefault();
    const folder = "blogposts";
    const setid = document.getElementById("currentblogpostkey").value;
    const formname = "updateblogpost";

    const newDocument = {
      postid: currentpostid,
      postindex: Number(currentpostindex),
      posturi: currentposturi,
      posttitle: currentposttitle,
      postcontent: currentpostcontent,
      postsummary: currentpostsummary,
      postthumbnail: currentpostthumbnail,
      postproductcode: currentpostproductcode,
      postcategorycode: currentpostcategorycode,
      postdate: currentpostdate,
      postiso8601: currentpostiso8601,
    };

    handleSetDocument(folder, setid, newDocument);

    resetForm(formname);
  }

  function handleEditBlogPostCancel() {
    const formname = "updateblogpost";
    resetForm(formname);
  }

  function handleDeleteBlogPostSubmit(currentvendorid) {
    const folder = "blogposts";
    const deleteid = document.getElementById("currentblogpostkey").value;
    const formname = "updateblogpost";
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
    if (formname === "addblogpost") {
      setPostId("");
      setPostIndex("");
      setPostUri("");
      setPostTitle("");
      setPostContent("");
      setPostSummary("");
      setPostThumbnail("");
      setPostProductCode("");
      setPostCategoryCode("");
      setPostDate("");
      setPostIso8601("");
    } else {
      setCurrentPostId("");
      setCurrentPostIndex("");
      setCurrentPostUri("");
      setCurrentPostTitle("");
      setCurrentPostContent("");
      setCurrentPostSummary("");
      setCurrentPostThumbnail("");
      setCurrentPostProductCode("");
      setCurrentPostCategoryCode("");
      setCurrentPostDate("");
      setCurrentPostIso8601("");
    }
  }

  return (
    <div className="main">
      <div className="center">
        <div className="recipe-list-box">
          <div className="recipe-list">
            <div className="recipe-card">
              <form
                onSubmit={handleBlogPostFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Add New Blog Post</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Post ID:
                      <input
                        type="text"
                        required
                        value={postid}
                        onChange={(e) => setPostId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Uri:
                      <input
                        type="text"
                        required
                        value={posturi}
                        onChange={(e) => setPostUri(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Title:
                      <input
                        type="text"
                        required
                        value={posttitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Content:
                      <input
                        type="text"
                        required
                        value={postcontent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Summary:
                      <input
                        type="text"
                        required
                        value={postsummary}
                        onChange={(e) => setPostSummary(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Thumbnail:
                      <input
                        type="text"
                        required
                        value={postthumbnail}
                        onChange={(e) => setPostThumbnail(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Product Code:
                      <input
                        type="text"
                        required
                        value={postproductcode}
                        onChange={(e) => setPostProductCode(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Category Code:
                      <input
                        type="text"
                        required
                        value={postcategorycode}
                        onChange={(e) => setPostCategoryCode(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Date:
                      <input
                        type="text"
                        required
                        value={postdate}
                        onChange={(e) => setPostDate(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Iso 8601:
                      <input
                        type="text"
                        required
                        value={postiso8601}
                        onChange={(e) => setPostIso8601(e.target.value)}
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
                    Add Blog Post
                  </button>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form className="add-edit-recipe-form-container">
                <h2>Search Blog Post</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Blog Post Id:
                      <input
                        id="blogpostid"
                        type="text"
                        required
                        className="input-text"
                        value={currentpostid}
                        onChange={(e) => setCurrentPostId(e.target.value)}
                      />
                    </label>

                    <button
                      type="button"
                      className="primary-button edit-button"
                      onClick={handleGetCurrentBlogPost}
                    >
                      Get Blog Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form
                onSubmit={handleUpdateBlogPostFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Update Blog Post</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Post Id:
                      <input
                        type="text"
                        required
                        readOnly
                        value={currentpostid}
                        onChange={(e) => setCurrentPostId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Uri:
                      <input
                        type="text"
                        required
                        value={currentposturi}
                        onChange={(e) => setCurrentPostUri(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Title:
                      <input
                        type="text"
                        required
                        value={currentposttitle}
                        onChange={(e) => setCurrentPostTitle(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Content:
                      <input
                        type="text"
                        required
                        value={currentpostcontent}
                        onChange={(e) => setCurrentPostContent(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Summary:
                      <input
                        type="text"
                        required
                        value={currentpostsummary}
                        onChange={(e) => setCurrentPostSummary(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Thumbnail:
                      <input
                        type="text"
                        value={currentpostthumbnail}
                        onChange={(e) =>
                          setCurrentPostThumbnail(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Product Code:
                      <input
                        type="text"
                        required
                        value={currentpostproductcode}
                        onChange={(e) =>
                          setCurrentPostProductCode(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Category Code:
                      <input
                        type="text"
                        required
                        value={currentpostcategorycode}
                        onChange={(e) =>
                          setCurrentPostCategoryCode(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Date:
                      <input
                        type="text"
                        required
                        value={currentpostdate}
                        onChange={(e) => setCurrentPostDate(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Post Iso 8601:
                      <input
                        type="text"
                        required
                        value={currentpostiso8601}
                        onChange={(e) => setCurrentPostIso8601(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Key:
                      <input
                        type="text"
                        id="currentpostkey"
                        required
                        readOnly
                        value={currentpostkey}
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
                      onClick={handleEditBlogPostCancel}
                      className="primary-button action-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteBlogPostSubmit}
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

export default AddEditBlogPostForm;
