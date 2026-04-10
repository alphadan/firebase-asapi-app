import { useState } from "react";

const AddEditNewsPostForm = ({
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
      newsid: "",
      newsindex: "",
      newscontent: "",
      newsheading: "",
      newssummary: "",
      newsdate: "",
      newsphotourl: "",
      newsphotothumb: "",
      newscategoryid: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("newsposts", initialItem.key, form);
      } else {
        await handleAddDocument("newsposts", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="add-edit-form">
      <h3>{isEdit ? "Edit News Post" : "Add News Post"}</h3>
      <form onSubmit={handleSubmit}>
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
          name="newscontent"
          value={form.newscontent}
          onChange={handleChange}
          placeholder="newscontent"
          required
        />
        <input
          name="newsheading"
          value={form.newsheading}
          onChange={handleChange}
          placeholder="newsheading"
          required
        />
        <input
          name="newssummary"
          value={form.newssummary}
          onChange={handleChange}
          placeholder="newssummary"
          required
        />
        <input
          name="newsdate"
          value={form.newsdate}
          onChange={handleChange}
          placeholder="newsdate"
          required
        />
        <input
          name="newsphotourl"
          value={form.newsphotourl}
          onChange={handleChange}
          placeholder="newsphotourl"
          required
        />
        <input
          name="newsphotothumb"
          value={form.newsphotothumb}
          onChange={handleChange}
          placeholder="newsphotothumb"
          required
        />
        <input
          name="newscategoryid"
          value={form.newscategoryid}
          onChange={handleChange}
          placeholder="newscategoryid"
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

export default AddEditNewsPostForm;
