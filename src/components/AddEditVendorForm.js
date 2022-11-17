import { useState } from "react";
import FirestoreDBService from "../FirestoreDBService.js";

function AddEditVendorForm({
  handleAddDocument,
  handleSetDocument,
  handleDeleteDocument,
}) {
  const [vendorcode, setVendorCode] = useState("");
  const [vendorfirstname, setVendorFirstName] = useState("");
  const [vendorlastname, setVendorLastName] = useState("");
  const [vendorname, setVendorName] = useState("");
  const [vendoraddress, setVendorAddress] = useState("");
  const [vendorcity, setVendorCity] = useState("");
  const [vendorstate, setVendorState] = useState("");
  const [vendorzipcode, setVendorZipCode] = useState("");
  const [vendorcountry, setVendorCountry] = useState("");
  const [vendorphone, setVendorPhone] = useState("");
  const [vendorfax, setVendorFax] = useState("");
  const [vendoremail, setVendorEmail] = useState("");
  const [currentvendorcode, setCurrentVendorCode] = useState("");
  const [currentvendorfirstname, setCurrentVendorFirstName] = useState("");
  const [currentvendorlastname, setCurrentVendorLastName] = useState("");
  const [currentvendorname, setCurrentVendorName] = useState("");
  const [currentvendoraddress, setCurrentVendorAddress] = useState("");
  const [currentvendorcity, setCurrentVendorCity] = useState("");
  const [currentvendorstate, setCurrentVendorState] = useState("");
  const [currentvendorzipcode, setCurrentVendorZipCode] = useState("");
  const [currentvendorcountry, setCurrentVendorCountry] = useState("");
  const [currentvendorphone, setCurrentVendorPhone] = useState("");
  const [currentvendorfax, setCurrentVendorFax] = useState("");
  const [currentvendoremail, setCurrentVendorEmail] = useState("");
  const [currentvendorid, setCurrentVendorId] = useState("");

  function handleVendorFormSubmit(e) {
    e.preventDefault();
    const folder = "vendors";
    const formname = "addvendor";

    const newDocument = {
      vendorcode,
      vendorfirstname,
      vendorlastname,
      vendorname,
      vendoraddress,
      vendorcity,
      vendorstate,
      vendorzipcode,
      vendorcountry,
      vendorphone,
      vendorfax,
      vendoremail,
    };

    handleAddDocument(folder, newDocument);

    resetForm(formname);
  }

  async function handleGetCurrentVendor() {
    const folder = "vendors";
    const queries = [];
    const queryvendorcode = document.getElementById("vendorcodeinput").value;

    queries.push({
      field: "vendorcode",
      condition: "==",
      value: queryvendorcode,
    });

    const querySnapshot = await FirestoreDBService.readCurrentItem(
      folder,
      queries
    );

    querySnapshot.forEach((doc) => {
      setCurrentVendorId(doc.id);
      setCurrentVendorCode(doc.get("vendorcode"));
      setCurrentVendorFirstName(doc.get("vendorfirstname"));
      setCurrentVendorLastName(doc.get("vendorlastname"));
      setCurrentVendorName(doc.get("vendorname"));
      setCurrentVendorAddress(doc.get("vendoraddress"));
      setCurrentVendorCity(doc.get("vendorcity"));
      setCurrentVendorState(doc.get("vendorstate"));
      setCurrentVendorZipCode(doc.get("vendorzipcode"));
      setCurrentVendorCountry(doc.get("vendorcountry"));
      setCurrentVendorPhone(doc.get("vendorphone"));
      setCurrentVendorFax(doc.get("vendorfax"));
      setCurrentVendorEmail(doc.get("vendoremail"));
    });
  }

  function handleUpdateVendorFormSubmit(e) {
    e.preventDefault();
    const folder = "vendors";
    const setid = document.getElementById("currentvendorcodeidinput").value;
    const formname = "updatevendor";

    const newDocument = {
      vendorcode: currentvendorcode,
      vendorfirstname: currentvendorfirstname,
      vendorlastname: currentvendorlastname,
      vendorname: currentvendorname,
      vendoraddress: currentvendoraddress,
      vendorcity: currentvendorcity,
      vendorstate: currentvendorstate,
      vendorzipcode: currentvendorzipcode,
      vendorcountry: currentvendorcountry,
      vendorphone: currentvendorphone,
      vendorfax: currentvendorfax,
      vendoremail: currentvendoremail,
    };

    handleSetDocument(folder, setid, newDocument);

    resetForm(formname);
  }

  function handleEditVendorCancel() {
    const formname = "updatevendor";
    resetForm(formname);
  }

  function handleDeleteVendorSubmit(currentvendorid) {
    const folder = "vendors";
    const deleteid = document.getElementById("currentvendorcodeidinput").value;
    const formname = "updatevendor";
    console.log("currentvendorid", currentvendorid);

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
    if (formname === "addvendor") {
      setVendorCode("");
      setVendorFirstName("");
      setVendorLastName("");
      setVendorName("");
      setVendorAddress("");
      setVendorCity("");
      setVendorState("");
      setVendorZipCode("");
      setVendorCountry("");
      setVendorPhone("");
      setVendorFax("");
      setVendorEmail("");
    } else {
      setCurrentVendorCode("");
      setCurrentVendorFirstName("");
      setCurrentVendorLastName("");
      setCurrentVendorName("");
      setCurrentVendorAddress("");
      setCurrentVendorCity("");
      setCurrentVendorState("");
      setCurrentVendorZipCode("");
      setCurrentVendorCountry("");
      setCurrentVendorPhone("");
      setCurrentVendorFax("");
      setCurrentVendorEmail("");
      setCurrentVendorId("");
    }
  }

  return (
    <div className="main">
      <div className="center">
        <div className="recipe-list-box">
          <div className="recipe-list">
            <div className="recipe-card">
              <form
                onSubmit={handleVendorFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Add New Vendor</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Code:
                      <input
                        type="text"
                        required
                        value={vendorcode}
                        onChange={(e) => setVendorCode(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Company Name:
                      <input
                        type="text"
                        required
                        value={vendorname}
                        onChange={(e) => setVendorName(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      First Name:
                      <input
                        type="text"
                        required
                        value={vendorfirstname}
                        onChange={(e) => setVendorFirstName(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Last Name:
                      <input
                        type="text"
                        required
                        value={vendorlastname}
                        onChange={(e) => setVendorLastName(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Address:
                      <input
                        type="text"
                        required
                        value={vendoraddress}
                        onChange={(e) => setVendorAddress(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      City:
                      <input
                        type="text"
                        required
                        value={vendorcity}
                        onChange={(e) => setVendorCity(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      State:
                      <input
                        type="text"
                        required
                        value={vendorstate}
                        onChange={(e) => setVendorState(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Zip Code:
                      <input
                        type="text"
                        required
                        value={vendorzipcode}
                        onChange={(e) => setVendorZipCode(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Country:
                      <input
                        type="text"
                        required
                        value={vendorcountry}
                        onChange={(e) => setVendorCountry(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Email:
                      <input
                        type="text"
                        required
                        value={vendoremail}
                        onChange={(e) => setVendorEmail(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Phone:
                      <input
                        type="text"
                        required
                        value={vendorphone}
                        onChange={(e) => setVendorPhone(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Fax:
                      <input
                        type="text"
                        required
                        value={vendorfax}
                        onChange={(e) => setVendorFax(e.target.value)}
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
                    Add Vendor
                  </button>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form className="add-edit-recipe-form-container">
                <h2>Search Vendor</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Vendor Code:
                      <input
                        id="vendorcodeinput"
                        type="text"
                        required
                        className="input-text"
                        value={currentvendorcode}
                        onChange={(e) => setCurrentVendorCode(e.target.value)}
                      />
                    </label>

                    <button
                      type="button"
                      className="primary-button edit-button"
                      onClick={handleGetCurrentVendor}
                    >
                      Get Vendor
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form
                onSubmit={handleUpdateVendorFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Update Vendor</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Code:
                      <input
                        type="text"
                        required
                        readOnly
                        value={currentvendorcode}
                        onChange={(e) => setCurrentVendorCode(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Company Name:
                      <input
                        type="text"
                        required
                        value={currentvendorname}
                        onChange={(e) => setCurrentVendorName(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      First Name:
                      <input
                        type="text"
                        required
                        value={currentvendorfirstname}
                        onChange={(e) =>
                          setCurrentVendorFirstName(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Last Name:
                      <input
                        type="text"
                        required
                        value={currentvendorlastname}
                        onChange={(e) =>
                          setCurrentVendorLastName(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Address:
                      <input
                        type="text"
                        required
                        value={currentvendoraddress}
                        onChange={(e) =>
                          setCurrentVendorAddress(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      City:
                      <input
                        type="text"
                        required
                        value={currentvendorcity}
                        onChange={(e) => setCurrentVendorCity(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      State:
                      <input
                        type="text"
                        required
                        value={currentvendorstate}
                        onChange={(e) => setCurrentVendorState(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Zip Code:
                      <input
                        type="text"
                        required
                        value={currentvendorzipcode}
                        onChange={(e) =>
                          setCurrentVendorZipCode(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Country:
                      <input
                        type="text"
                        required
                        value={currentvendorcountry}
                        onChange={(e) =>
                          setCurrentVendorCountry(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Email:
                      <input
                        type="text"
                        required
                        value={currentvendoremail}
                        onChange={(e) => setCurrentVendorEmail(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Phone:
                      <input
                        type="text"
                        required
                        value={currentvendorphone}
                        onChange={(e) => setCurrentVendorPhone(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Fax:
                      <input
                        type="text"
                        required
                        value={currentvendorfax}
                        onChange={(e) => setCurrentVendorFax(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      ID:
                      <input
                        id="currentvendorcodeidinput"
                        type="text"
                        required
                        readOnly
                        value={currentvendorid}
                        onChange={(e) => setCurrentVendorId(e.target.value)}
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
                      onClick={handleEditVendorCancel}
                      className="primary-button action-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteVendorSubmit}
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
