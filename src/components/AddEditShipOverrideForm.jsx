import { useState } from "react";

const AddEditShipOverrideForm = ({
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
      productcode: "",
      productid: "",
      shipzone1: "",
      shipzone2: "",
      shipzone3: "",
      shipzone4: "",
      shipzone5: "",
      shipzone6: "",
      shipzone7: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("shipoverride", initialItem.key, form);
      } else {
        await handleAddDocument("shipoverride", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="add-edit-form">
      <h3>{isEdit ? "Edit Ship Override" : "Add Ship Override"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="productcode"
          value={form.productcode}
          onChange={handleChange}
          placeholder="productcode"
          required
        />
        <input
          name="productid"
          value={form.productid}
          onChange={handleChange}
          placeholder="productid"
        />
        <input
          name="shipzone1"
          value={form.shipzone1}
          onChange={handleChange}
          placeholder="shipzone1"
        />
        <input
          name="shipzone2"
          value={form.shipzone2}
          onChange={handleChange}
          placeholder="shipzone2"
        />
        <input
          name="shipzone3"
          value={form.shipzone3}
          onChange={handleChange}
          placeholder="shipzone3"
        />
        <input
          name="shipzone4"
          value={form.shipzone4}
          onChange={handleChange}
          placeholder="shipzone4"
        />
        <input
          name="shipzone5"
          value={form.shipzone5}
          onChange={handleChange}
          placeholder="shipzone5"
        />
        <input
          name="shipzone6"
          value={form.shipzone6}
          onChange={handleChange}
          placeholder="shipzone6"
        />
        <input
          name="shipzone7"
          value={form.shipzone7}
          onChange={handleChange}
          placeholder="shipzone7"
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

export default AddEditShipOverrideForm;
