import { useState } from "react";
import FirestoreDBService from "../FirestoreDBService.js";

function AddEditVendorForm({
  handleAddDocument,
  handleSetDocument,
  handleDeleteDocument,
}) {
  const [productcode, setProductCode] = useState("");
  const [productid, setProductId] = useState("");
  const [shipzone1, setShipZone1] = useState("");
  const [shipzone2, setShipZone2] = useState("");
  const [shipzone3, setShipZone3] = useState("");
  const [shipzone4, setShipZone4] = useState("");
  const [shipzone5, setShipZone5] = useState("");
  const [shipzone6, setShipZone6] = useState("");
  const [shipzone7, setShipZone7] = useState("");
  const [currentproductcode, setCurrentProductCode] = useState("");
  const [currentproductid, setCurrentProductId] = useState("");
  const [currentshipzone1, setCurrentShipZone1] = useState("");
  const [currentshipzone2, setCurrentShipZone2] = useState("");
  const [currentshipzone3, setCurrentShipZone3] = useState("");
  const [currentshipzone4, setCurrentShipZone4] = useState("");
  const [currentshipzone5, setCurrentShipZone5] = useState("");
  const [currentshipzone6, setCurrentShipZone6] = useState("");
  const [currentshipzone7, setCurrentShipZone7] = useState("");
  const [currentproductkey, setCurrentProductKey] = useState("");

  function handleShipOverrideFormSubmit(e) {
    e.preventDefault();
    const folder = "shipoverride";
    const formname = "addshipoverride";

    const newDocument = {
      productcode,
      productid,
      shipzone1,
      shipzone2,
      shipzone3,
      shipzone4,
      shipzone5,
      shipzone6,
      shipzone7,
    };

    handleAddDocument(folder, newDocument);
    resetForm(formname);
  }

  async function handleGetCurrentShipOverride() {
    const folder = "shipoverride";
    const queries = [];
    const queryproductcode = document.getElementById("productcodeinput").value;

    console.log(
      "[handleGetCurrentShipOverride]:queryproductcode",
      queryproductcode
    );

    queries.push({
      field: "productcode",
      condition: "==",
      value: queryproductcode,
    });

    const querySnapshot = await FirestoreDBService.readCurrentItem(
      folder,
      queries
    );

    querySnapshot.forEach((doc) => {
      setCurrentProductCode(doc.get("productcode"));
      setCurrentProductId(doc.get("productid"));
      setCurrentShipZone1(doc.get("shipzone1"));
      setCurrentShipZone2(doc.get("shipzone2"));
      setCurrentShipZone3(doc.get("shipzone3"));
      setCurrentShipZone4(doc.get("shipzone4"));
      setCurrentShipZone5(doc.get("shipzone5"));
      setCurrentShipZone6(doc.get("shipzone6"));
      setCurrentShipZone7(doc.get("shipzone7"));
      setCurrentProductKey(doc.id);
    });
  }

  function handleUpdateShipOverideFormSubmit(e) {
    e.preventDefault();
    const folder = "shipoverride";
    const setid = document.getElementById("currentshipoverridekeyinput").value;
    const formname = "updateshipoverride";

    const newDocument = {
      productcode: currentproductcode,
      productid: currentproductid,
      ship_zone_1: currentshipzone1,
      ship_zone_2: currentshipzone2,
      ship_zone_3: currentshipzone3,
      ship_zone_4: currentshipzone4,
      ship_zone_5: currentshipzone5,
      ship_zone_6: currentshipzone6,
      ship_zone_7: currentshipzone7,
    };

    handleSetDocument(folder, setid, newDocument);

    resetForm(formname);
  }

  function handleEditShipOverrideCancel() {
    const formname = "updatevendor";
    resetForm(formname);
  }

  function handleDeleteShipOverrideSubmit(currentproductid) {
    const folder = "shipoverride";
    const deleteid = document.getElementById(
      "currentshipoverridekeyinput"
    ).value;
    const formname = "updateshipoverride";
    console.log("currentproductid", currentproductid);

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
    if (formname === "addshipoverride") {
      setProductCode("");
      setProductId("");
      setShipZone1("");
      setShipZone2("");
      setShipZone3("");
      setShipZone4("");
      setShipZone5("");
      setShipZone6("");
      setShipZone7("");
    } else {
      setCurrentProductCode("");
      setCurrentProductId("");
      setCurrentShipZone1("");
      setCurrentShipZone2("");
      setCurrentShipZone3("");
      setCurrentShipZone4("");
      setCurrentShipZone5("");
      setCurrentShipZone6("");
      setCurrentShipZone7("");
    }
  }

  return (
    <div className="main">
      <div className="center">
        <div className="recipe-list-box">
          <div className="recipe-list">
            <div className="recipe-card">
              <form
                onSubmit={handleShipOverrideFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Add New Ship Override</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Product Code:
                      <input
                        type="text"
                        required
                        value={productcode}
                        onChange={(e) => setProductCode(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Product Id:
                      <input
                        type="text"
                        required
                        value={productid}
                        onChange={(e) => setProductId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 1:
                      <input
                        type="text"
                        required
                        value={shipzone1}
                        onChange={(e) => setShipZone1(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 2:
                      <input
                        type="text"
                        required
                        value={shipzone2}
                        onChange={(e) => setShipZone2(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 3:
                      <input
                        type="text"
                        required
                        value={shipzone3}
                        onChange={(e) => setShipZone3(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 4:
                      <input
                        type="text"
                        required
                        value={shipzone4}
                        onChange={(e) => setShipZone4(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 5:
                      <input
                        type="text"
                        required
                        value={shipzone5}
                        onChange={(e) => setShipZone5(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 6:
                      <input
                        type="text"
                        required
                        value={shipzone6}
                        onChange={(e) => setShipZone6(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 7:
                      <input
                        type="text"
                        required
                        value={shipzone7}
                        onChange={(e) => setShipZone7(e.target.value)}
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
                    Add Ship Override
                  </button>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form className="add-edit-recipe-form-container">
                <h2>Search Ship Override</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Product Code:
                      <input
                        id="productcodeinput"
                        type="text"
                        required
                        className="input-text"
                        value={currentproductcode}
                        onChange={(e) => setCurrentProductCode(e.target.value)}
                      />
                    </label>

                    <button
                      type="button"
                      className="primary-button edit-button"
                      onClick={handleGetCurrentShipOverride}
                    >
                      Get Ship Override
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form
                onSubmit={handleUpdateShipOverideFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Update Ship Override</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Product Code:
                      <input
                        type="text"
                        required
                        readOnly
                        value={currentproductcode}
                        onChange={(e) => setCurrentProductCode(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Product Id:
                      <input
                        type="text"
                        required
                        value={currentproductid}
                        onChange={(e) => setCurrentProductId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 1:
                      <input
                        type="text"
                        required
                        value={currentshipzone1}
                        onChange={(e) => setCurrentShipZone1(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 2:
                      <input
                        type="text"
                        required
                        value={currentshipzone2}
                        onChange={(e) => setCurrentShipZone2(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 3:
                      <input
                        type="text"
                        required
                        value={currentshipzone3}
                        onChange={(e) => setCurrentShipZone3(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 4:
                      <input
                        type="text"
                        required
                        value={currentshipzone4}
                        onChange={(e) => setCurrentShipZone4(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 5:
                      <input
                        type="text"
                        required
                        value={currentshipzone5}
                        onChange={(e) => setCurrentShipZone5(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 6:
                      <input
                        type="text"
                        required
                        value={currentshipzone6}
                        onChange={(e) => setCurrentShipZone6(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Ship Zone 7:
                      <input
                        type="text"
                        required
                        value={currentshipzone7}
                        onChange={(e) => setCurrentShipZone7(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Key:
                      <input
                        id="currentshipoverridekeyinput"
                        type="text"
                        required
                        readOnly
                        value={currentproductkey}
                        onChange={(e) => setCurrentProductKey(e.target.value)}
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
                      onClick={handleEditShipOverrideCancel}
                      className="primary-button action-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteShipOverrideSubmit}
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

export default AddEditVendorForm;
