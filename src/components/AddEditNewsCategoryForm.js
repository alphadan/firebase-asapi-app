import { useState } from "react";

const AddEditNewsCategoryForm = ({
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
      newsactive: "",
      newscategoryid: "",
      newscategoryname: "",
      newsdescription: "",
      newsid: "",
      newsindex: "",
      newsuri: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("newscategories", initialItem.key, form);
      } else {
        await handleAddDocument("newscategories", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="add-edit-form">
      <h3>{isEdit ? "Edit News Category" : "Add News Category"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="newsactive"
          value={form.newsactive}
          onChange={handleChange}
          placeholder="newsactive"
          required
        />
        <input
          name="newscategoryid"
          value={form.newscategoryid}
          onChange={handleChange}
          placeholder="newscategoryid"
          required
        />
        <input
          name="newscategoryname"
          value={form.newscategoryname}
          onChange={handleChange}
          placeholder="newscategoryname"
          required
        />
        <input
          name="newsdescription"
          value={form.newsdescription}
          onChange={handleChange}
          placeholder="newsdescription"
          required
        />
        <input
          name="newsid"
          value={form.newsid}
          onChange={handleChange}
          placeholder="newsid"
          required
        />
        <input
          name="newsindex"
          value={form.newsindex}
          onChange={handleChange}
          placeholder="newsindex"
          required
        />
        <input
          name="newsuri"
          value={form.newsuri}
          onChange={handleChange}
          placeholder="newsuri"
          required
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

export default AddEditNewsCategoryForm;
