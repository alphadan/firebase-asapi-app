import { useEffect, useState } from "react";
import FirebaseAuthService from "./FirebaseAuthService.js";
import FirestoreDBService from "./FirestoreDBService.js";
import LoginForm from "./components/LoginForm.js";
import AddEditVendorForm from "./components/AddEditVendorForm.js";
import AddEditReviewStatsForm from "./components/AddEditReviewStatsForm.js";
import AddEditShipOverrideForm from "./components/AddEditShipOverrideForm.js";
import AddEditReviewsForm from "./components/AddEditReviewsForm.js";
import AddEditBlogCategoryForm from "./components/AddEditBlogCategoryForm.js";
import AddEditBlogPostForm from "./components/AddEditBlogPostForm.js";
import AddEditNewsCategoryForm from "./components/AddEditNewsCategoryForm.js";
import AddEditNewsPostForm from "./components/AddEditNewsPostForm.js";
import "./App.css";
import companyLogo from "./images/alphabet-signs-logo-450.png";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [folder, setFolder] = useState("vendors");
  const [orderByDirection, setOrderByDirection] = useState("asc");
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);

    fetchData(folder, orderByDirection)
      .then((list) => {
        console.log("list ", list);
        setList(list);
      })
      .catch((error) => {
        console.log(error.message);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user, folder, orderByDirection]);

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  async function fetchData(folder, orderByDirection) {
    console.log("[fetchData]:BEGIN");
    const list = await FirestoreDBService.handleFetchData(
      folder,
      orderByDirection
    );
    console.log("[fetchData]:list", list);
    setList(list);
    return list;
  }

  async function handleFetchData(folder, orderByDirection) {
    console.log("[handleFetchData]BEGIN");
    try {
      const list = await fetchData(folder, orderByDirection);
      setList(list);
      console.log("[handleFetchData]:list", list);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async function handleShowPrevious(folder, { item }, orderByDirection) {
    console.log("[handleShowPrevious]:item", item);
    try {
      const list = await FirestoreDBService.showPrevious(
        folder,
        item,
        orderByDirection
      );
      console.log("[handleShowPrevious]:list", list);
      setPage(page - 1);
      setList(list);
      return list;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async function handleShowNext(folder, { item }, orderByDirection) {
    console.log("[handleShowNext]:item", item);
    try {
      const list = await FirestoreDBService.showNext(
        folder,
        item,
        orderByDirection
      );
      console.log("[handleShowNext]:list", list);
      setPage(page + 1);
      setList(list);
      return list;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async function handleAddDocument(folder, newDocument) {
    console.log("[handleAddDocument]BEGIN");
    try {
      const docRef = await FirestoreDBService.createNewDocument(
        folder,
        newDocument
      );

      handleFetchData(folder, orderByDirection);

      console.log("[handleAddDocument]BEGIN");

      alert(`succesfully created a doument with an ID = ${docRef.id}`);
      return;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async function handleSetDocument(folder, setid, newDocument) {
    try {
      await FirestoreDBService.setDocument(folder, setid, newDocument);

      handleFetchData(folder, orderByDirection);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async function handleSetReviewDocument(folder, setid, newDocument) {
    try {
      await FirestoreDBService.updateReviewDocument(folder, setid, newDocument);

      handleFetchData(folder, orderByDirection);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async function handleDeleteDocument(folder, deleteid) {
    try {
      await FirestoreDBService.deleteDocument(folder, deleteid);
      handleFetchData(folder, orderByDirection);

      console.log("successfully deleted a vendor with an ID");
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  return (
    <div className="App">
      <div className="title-row">
        <div className="logoimg">
          <img src={companyLogo} alt="logo" />
        </div>
        <LoginForm existingUser={user}></LoginForm>
      </div>
      <div className="main">
        <div className="row filters">
          <label className="recipe-label input-label">
            Collection:
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="select"
            >
              <option value="vendors">Vendors</option>
              <option value="reviewstats">Review Stats</option>
              <option value="shipoverride">Ship Override</option>
              <option value="reviews">Reviews</option>
              <option value="blogcategories">Blog Categories</option>
              <option value="blogposts">Blog Posts</option>
              <option value="newscategories">News Categories</option>
              <option value="newsposts">News Posts</option>
            </select>
          </label>
          {list && folder === "reviews" ? (
            <label className="input-label">
              <select
                value={orderByDirection}
                onChange={(e) => setOrderByDirection(e.target.value)}
                className="select"
              >
                <option value="asc">Date (oldest - newest)</option>
                <option value="desc">Date (newest - oldest)</option>
              </select>
            </label>
          ) : null}
          {list && folder === "vendors" ? (
            <label className="input-label">
              <select
                value={orderByDirection}
                onChange={(e) => setOrderByDirection(e.target.value)}
                className="select"
              >
                <option value="asc">Company name (A - Z)</option>
                <option value="desc">Company name (Z -A)</option>
              </select>
            </label>
          ) : null}
          {list && folder === "shipoverride" ? (
            <label className="input-label">
              <select
                value={orderByDirection}
                onChange={(e) => setOrderByDirection(e.target.value)}
                className="select"
              >
                <option value="asc">Product Code (A - Z)</option>
                <option value="desc">Product Code (Z -A)</option>
              </select>
            </label>
          ) : null}
          {list && folder === "blogcategories" ? (
            <label className="input-label">
              <select
                value={orderByDirection}
                onChange={(e) => setOrderByDirection(e.target.value)}
                className="select"
              >
                <option value="asc">Category (A - Z)</option>
                <option value="desc">Category (Z -A)</option>
              </select>
            </label>
          ) : null}
          {list && folder === "blogposts" ? (
            <label className="input-label">
              <select
                value={orderByDirection}
                onChange={(e) => setOrderByDirection(e.target.value)}
                className="select"
              >
                <option value="asc">Date (oldest - newest)</option>
                <option value="desc">Date (newest - oldest)</option>
              </select>
            </label>
          ) : null}
          {list && folder === "newscategories" ? (
            <label className="input-label">
              <select
                value={orderByDirection}
                onChange={(e) => setOrderByDirection(e.target.value)}
                className="select"
              >
                <option value="asc">Category (A - Z)</option>
                <option value="desc">Category (Z -A)</option>
              </select>
            </label>
          ) : null}
          {list && folder === "newsposts" ? (
            <label className="input-label">
              <select
                value={orderByDirection}
                onChange={(e) => setOrderByDirection(e.target.value)}
                className="select"
              >
                <option value="asc">Date (oldest - newest)</option>
                <option value="desc">Date (newest - oldest)</option>
              </select>
            </label>
          ) : null}
        </div>
        <div className="center">
          <div className="recipe-list-box">
            {isLoading ? (
              <div className="fire">
                <div className="flames">
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                </div>
                <div className="logs"></div>
              </div>
            ) : null}
            {!isLoading && list && list.length === 0 ? (
              <h5 className="no-recipes">No List Found</h5>
            ) : null}
            {list && folder === "reviews" && list.length > 0 ? (
              <div className="recipe-list">
                {list.map((item) => {
                  return (
                    <div className="recipe-card" key={item.key}>
                      <div className="recipe-name">{item.reviewheadline}</div>
                      <div className="recipe-field">
                        Product Code: {item.reviewpageid}
                      </div>
                      <div className="recipe-field">
                        Order #: {item.revieworderid}
                      </div>
                      <div className="recipe-field">
                        Date: {item.reviewcreatedate}
                      </div>
                      <div className="recipe-field">
                        Review Id: {item.reviewid}
                      </div>
                      <div className="recipe-field">
                        Rating: {item.reviewoverallrating}
                      </div>
                      <div className="recipe-field">{item.reviewcomments}</div>
                      <div className="recipe-field">{item.reviewnickname}</div>
                      <div className="recipe-field">{item.reviewlocation}</div>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {list && folder === "vendors" && list.length > 0 ? (
              <div className="recipe-list">
                {list.map((item) => {
                  return (
                    <div className="recipe-card" key={item.key}>
                      <div className="recipe-name">{item.vendorname}</div>
                      <div className="recipe-field">{item.vendorcode}</div>
                      <div className="recipe-field">{item.vendoraddress}</div>
                      <div className="recipe-field">
                        {item.vendorcity}, {item.vendorstate}{" "}
                        {item.vendorzipcode}
                      </div>
                      <div className="recipe-field">{item.vendorphone}</div>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {list && folder === "reviewstats" && list.length > 0 ? (
              <div className="recipe-list">
                {list.map((item) => {
                  return (
                    <div className="recipe-card" key={item.key}>
                      <div className="recipe-name">Review Stats</div>
                      <div className="recipe-field">
                        <span>Total: </span>
                        {item.total_reviews}
                      </div>
                      <div className="recipe-field">
                        <span>Formatted: </span>
                        {item.total_reviews_formatted}
                      </div>
                      <div className="recipe-field">
                        <span>Google Eligible: </span>
                        {item.total_google_eligible}
                      </div>
                      <div className="recipe-field">
                        <span>Average Rating: </span>
                        {item.average_rating}
                      </div>
                      <div className="recipe-field">
                        <span>5 Stars: </span>
                        {item.fivestar}
                      </div>
                      <div className="recipe-field">
                        <span>4 Stars: </span>
                        {item.fourstar}
                      </div>
                      <div className="recipe-field">
                        <span>3 Stars: </span>
                        {item.threestar}
                      </div>
                      <div className="recipe-field">
                        <span>2 Stars: </span>
                        {item.twostar}
                      </div>
                      <div className="recipe-field">
                        <span>1 Stars: </span>
                        {item.onestar}
                      </div>
                      <div className="recipe-field">
                        <span>Key: </span>
                        {item.key}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {list && folder === "shipoverride" && list.length > 0 ? (
              <div className="recipe-list">
                {list.map((item) => {
                  return (
                    <div className="recipe-card" key={item.key}>
                      <div className="recipe-name">
                        <span>Code: </span>
                        {item.productcode}
                      </div>
                      <div className="recipe-field">
                        <span>Id: </span>
                        {item.productid}
                      </div>
                      <div className="recipe-field">
                        <span>Zone 1: </span>
                        {item.shipzone1}
                      </div>
                      <div className="recipe-field">
                        <span>Zone 2: </span>
                        {item.shipzone2}
                      </div>
                      <div className="recipe-field">
                        <span>Zone 3: </span>
                        {item.shipzone3}
                      </div>
                      <div className="recipe-field">
                        <span>Zone 4: </span>
                        {item.shipzone4}
                      </div>
                      <div className="recipe-field">
                        <span>Zone 5: </span>
                        {item.shipzone5}
                      </div>
                      <div className="recipe-field">
                        <span>Zone 6: </span>
                        {item.shipzone6}
                      </div>
                      <div className="recipe-field">
                        <span>Zone 7: </span>
                        {item.shipzone7}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {list && folder === "blogcategories" && list.length > 0 ? (
              <div className="recipe-list">
                {list.map((item) => {
                  return (
                    <div className="recipe-card" key={item.key}>
                      <div className="recipe-name">{item.blogcategoryname}</div>
                      <div className="recipe-field">
                        <span>Blog_uri: </span>
                        {item.bloguri}
                      </div>
                      <div className="recipe-field">
                        <span>BlogCategoryID: </span>
                        {item.blogcategoryid}
                      </div>
                      <div className="recipe-field">
                        <span>blogMetaDescription: </span>
                        {item.blogmetadescription}
                      </div>
                      <div className="recipe-field">
                        <span>active: </span>
                        {item.blogactive}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {list && folder === "blogposts" && list.length > 0 ? (
              <div className="recipe-list">
                {list.map((item) => {
                  return (
                    <div className="recipe-card" key={item.key}>
                      <div className="recipe-name">{item.postid}</div>
                      <div className="recipe-field">
                        <span>Post Title: </span>
                        {item.posttitle}
                      </div>
                      <div className="recipe-field">
                        <span>Post Uri: </span>
                        {item.posturi}
                      </div>
                      <div className="recipe-field">
                        <span>Post Content: </span>
                        {item.postcontent}
                      </div>
                      <div className="recipe-field">
                        <span>Post Summary: </span>
                        {item.postsummary}
                      </div>
                      <div className="recipe-field">
                        <span>Post Thumbnail: </span>
                        {item.postthumbnail}
                      </div>
                      <div className="recipe-field">
                        <span>Post Product Code: </span>
                        {item.postproductcode}
                      </div>
                      <div className="recipe-field">
                        <span>Post Category Code: </span>
                        {item.postcategorycode}
                      </div>
                      <div className="recipe-field">
                        <span>Post Date: </span>
                        {item.postdate}
                      </div>
                      <div className="recipe-field">
                        <span>Post ISO 8601: </span>
                        {item.postiso8601}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {list && folder === "newscategories" && list.length > 0 ? (
              <div className="recipe-list">
                {list.map((item) => {
                  return (
                    <div className="recipe-card" key={item.key}>
                      <div className="recipe-name">{item.newscategoryname}</div>
                      <div className="recipe-field">
                        <span>News_uri: </span>
                        {item.newsuri}
                      </div>
                      <div className="recipe-field">
                        <span>NewsCategoryID: </span>
                        {item.newscategoryid}
                      </div>
                      <div className="recipe-field">
                        <span>newsMetaDescription: </span>
                        {item.newsmetadescription}
                      </div>
                      <div className="recipe-field">
                        <span>active: </span>
                        {item.newsactive}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {list && folder === "newsposts" && list.length > 0 ? (
              <div className="recipe-list">
                {list.map((item) => {
                  return (
                    <div className="recipe-card" key={item.key}>
                      <div className="recipe-name">{item.newsid}</div>
                      <div className="recipe-field">
                        <span>News Index: </span>
                        {item.newsindex}
                      </div>
                      <div className="recipe-field">
                        <span>News Category Id: </span>
                        {item.newscategoryid}
                      </div>
                      <div className="recipe-field">
                        <span>News Content: </span>
                        {item.newscontent}
                      </div>
                      <div className="recipe-field">
                        <span>News Heading: </span>
                        {item.newsheading}
                      </div>
                      <div className="recipe-field">
                        <span>News Summary: </span>
                        {item.newssummary}
                      </div>
                      <div className="recipe-field">
                        <span>News Date: </span>
                        {item.newsdate}
                      </div>
                      <div className="recipe-field">
                        <span>News setNewsPhotoUrl: </span>
                        {item.newsphotourl}
                      </div>
                      <div className="recipe-field">
                        <span>News Photo Thumb: </span>
                        {item.newsphotothumb}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <>
            <div className="action-buttons">
              {page === 1 ? (
                ""
              ) : (
                <button
                  className="primary-button action-button"
                  onClick={() =>
                    handleShowPrevious(
                      folder,
                      { item: list[0] },
                      orderByDirection
                    )
                  }
                >
                  Previous
                </button>
              )}
              {list.length < 8 ? (
                ""
              ) : (
                <button
                  className="primary-button action-button"
                  onClick={() =>
                    handleShowNext(
                      folder,
                      { item: list[list.length - 1] },
                      orderByDirection
                    )
                  }
                >
                  Next
                </button>
              )}
            </div>
          </>
        </div>
        {user && folder === "vendors" ? (
          <AddEditVendorForm
            handleAddDocument={handleAddDocument}
            handleSetDocument={handleSetDocument}
            handleDeleteDocument={handleDeleteDocument}
          ></AddEditVendorForm>
        ) : null}
        {user && folder === "reviewstats" ? (
          <AddEditReviewStatsForm
            handleSetDocument={handleSetDocument}
          ></AddEditReviewStatsForm>
        ) : null}
        {user && folder === "shipoverride" ? (
          <AddEditShipOverrideForm
            handleAddDocument={handleAddDocument}
            handleSetDocument={handleSetDocument}
            handleDeleteDocument={handleDeleteDocument}
          ></AddEditShipOverrideForm>
        ) : null}
        {user && folder === "reviews" ? (
          <AddEditReviewsForm
            handleAddDocument={handleAddDocument}
            handleSetDocument={handleSetDocument}
            handleSetReviewDocument={handleSetReviewDocument}
            handleDeleteDocument={handleDeleteDocument}
          ></AddEditReviewsForm>
        ) : null}
        {user && folder === "blogcategories" ? (
          <AddEditBlogCategoryForm
            handleAddDocument={handleAddDocument}
            handleSetDocument={handleSetDocument}
            handleSetReviewDocument={handleSetReviewDocument}
            handleDeleteDocument={handleDeleteDocument}
          ></AddEditBlogCategoryForm>
        ) : null}
        {user && folder === "blogposts" ? (
          <AddEditBlogPostForm
            handleAddDocument={handleAddDocument}
            handleSetDocument={handleSetDocument}
            handleSetReviewDocument={handleSetReviewDocument}
            handleDeleteDocument={handleDeleteDocument}
          ></AddEditBlogPostForm>
        ) : null}
        {user && folder === "newscategories" ? (
          <AddEditNewsCategoryForm
            handleAddDocument={handleAddDocument}
            handleSetDocument={handleSetDocument}
            handleSetReviewDocument={handleSetReviewDocument}
            handleDeleteDocument={handleDeleteDocument}
          ></AddEditNewsCategoryForm>
        ) : null}
        {user && folder === "newsposts" ? (
          <AddEditNewsPostForm
            handleAddDocument={handleAddDocument}
            handleSetDocument={handleSetDocument}
            handleSetReviewDocument={handleSetReviewDocument}
            handleDeleteDocument={handleDeleteDocument}
          ></AddEditNewsPostForm>
        ) : null}
      </div>
    </div>
  );
}

export default App;
