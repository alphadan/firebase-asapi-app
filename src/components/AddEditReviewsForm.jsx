import { useState } from "react";

const AddEditReviewsForm = ({
  handleAddDocument,
  handleSetDocument,
  handleDeleteDocument,
  initialItem,
  onCancel,
  onSave,
}) => {
  const isEdit = !!initialItem?.key;

  const [form, setForm] = useState(
    initialItem || {
      reviewid: "",
      reviewindex: "",
      reviewpageid: "",
      reviewmerchantreviewid: "",
      reviewstatus: "",
      reviewcreatedate: "",
      reviewconfirmstatus: "",
      reviewheadline: "",
      reviewoverallrating: "",
      reviewbottomline: "",
      reviewcomments: "",
      reviewnickname: "",
      reviewlocation: "",
      reviewservicecomments: "",
      reviewcustomerimage: "",
      reviewcaption: "",
      reviewfullimagelocation: "",
      reviewthumbnaillocation: "",
      reviewpictag: "",
      reviewlanguage: "",
      revieworderid: "",
      reviewprivate: "",
      reviewresponse: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("vendors", initialItem.key, form);
      } else {
        await handleAddDocument("vendors", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="add-edit-form">
      <h3>{isEdit ? "Edit Review" : "Add Review"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="vendorname"
          value={form.vendorname}
          onChange={handleChange}
          placeholder="Company"
          required
        />
        <input
          name="vendorcode"
          value={form.vendorcode}
          onChange={handleChange}
          placeholder="Code"
        />
        <input
          name="vendoraddress"
          value={form.vendoraddress}
          onChange={handleChange}
          placeholder="Address"
        />
        <input
          name="vendorcity"
          value={form.vendorcity}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          name="vendorstate"
          value={form.vendorstate}
          onChange={handleChange}
          placeholder="State"
        />
        <input
          name="vendorzipcode"
          value={form.vendorzipcode}
          onChange={handleChange}
          placeholder="Zip"
        />
        <input
          name="vendorphone"
          value={form.vendorphone}
          onChange={handleChange}
          placeholder="Phone"
        />

        <div className="action-buttons">
          <button type="submit" className="primary-button">
            {isEdit ? "Update" : "Create"}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={onCancel}
              className="secondary-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEditReviewsForm;
