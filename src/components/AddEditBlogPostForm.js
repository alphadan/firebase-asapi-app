import { useState } from "react";

const AddEditBlogPostForm = ({
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
      postid: "",
      postindex: "",
      posturi: "",
      posttitle: "",
      postcontent: "",
      postsummary: "",
      postthumbnail: "",
      postproductcode: "",
      postcategorycode: "",
      postdate: "",
      postiso8601: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("blogposts", initialItem.key, form);
      } else {
        await handleAddDocument("blogposts", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="add-edit-form">
      <h3>{isEdit ? "Edit Blog Post" : "Add Bolg Post"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="postid"
          value={form.postid}
          onChange={handleChange}
          placeholder="postid"
          required
        />
        <input
          name="postindex"
          value={form.postindex}
          onChange={handleChange}
          placeholder="postindex"
          required
        />
        <input
          name="posturi"
          value={form.posturi}
          onChange={handleChange}
          placeholder="posturi"
          required
        />
        <input
          name="posttitle"
          value={form.posttitle}
          onChange={handleChange}
          placeholder="posttitle"
          required
        />
        <input
          name="postcontent"
          value={form.postcontent}
          onChange={handleChange}
          placeholder="postcontent"
          required
        />
        <input
          name="postsummary"
          value={form.postsummary}
          onChange={handleChange}
          placeholder="postsummary"
          required
        />
        <input
          name="postthumbnail"
          value={form.postthumbnail}
          onChange={handleChange}
          placeholder="postthumbnail"
          required
        />
        <input
          name="postproductcode"
          value={form.postproductcode}
          onChange={handleChange}
          placeholder="postproductcode"
          required
        />
        <input
          name="postcategorycode"
          value={form.postcategorycode}
          onChange={handleChange}
          placeholder="postcategorycode"
          required
        />
        <input
          name="postdate"
          value={form.postdate}
          onChange={handleChange}
          placeholder="postdate"
          required
        />
        <input
          name="postiso8601"
          value={form.postiso8601}
          onChange={handleChange}
          placeholder="postiso8601"
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

export default AddEditBlogPostForm;
