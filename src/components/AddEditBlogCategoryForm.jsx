import { useState } from "react";

const AddEditBlogCategoryForm = ({
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
      blogactive: "",
      blogcategoryid: "",
      blogcategoryname: "",
      blogid: "",
      blogmetadescription: "",
      bloguri: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("blogcategories", initialItem.key, form);
      } else {
        await handleAddDocument("blogcategories", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="add-edit-form">
      <h3>{isEdit ? "Edit Blog Category" : "Add Blog Category"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="blogactive"
          value={form.blogactive}
          onChange={handleChange}
          placeholder="blogactive"
          required
        />
        <input
          name="blogcategoryid"
          value={form.blogcategoryid}
          onChange={handleChange}
          placeholder="blogcategoryid"
        />
        <input
          name="blogcategoryname"
          value={form.blogcategoryname}
          onChange={handleChange}
          placeholder="blogcategoryname"
        />
        <input
          name="blogid"
          value={form.blogid}
          onChange={handleChange}
          placeholder="blogid"
        />
        <input
          name="blogmetadescription"
          value={form.blogmetadescription}
          onChange={handleChange}
          placeholder="State"
        />
        <input
          name="bloguri"
          value={form.bloguri}
          onChange={handleChange}
          placeholder="bloguri"
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

export default AddEditBlogCategoryForm;
