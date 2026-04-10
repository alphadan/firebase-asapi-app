import { useState } from "react";

const AddEditReviewStatsForm = ({
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
      reviewstatsid: "",
      total_reviews: "",
      total_reviews_formatted: "",
      reviewscount: "",
      lastmerchantreviewid: "",
      lastupdated: "",
      total_google_eligible: "",
      average_rating: "",
      fivestar: "",
      fourstar: "",
      threestar: "",
      twostar: "",
      onestar: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await handleSetDocument("reviewstats", initialItem.key, form);
      } else {
        await handleAddDocument("reviewstats", form);
      }
      onSave?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="add-edit-form">
      <h3>{isEdit ? "Edit Review Stats" : "Add Review Stats"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="reviewstatsid"
          value={form.reviewstatsid}
          onChange={handleChange}
          placeholder="reviewstatsid"
          required
        />
        <input
          name="total_reviews"
          value={form.total_reviews}
          onChange={handleChange}
          placeholder="total_reviews"
          required
        />
        <input
          name="total_reviews_formatted"
          value={form.total_reviews_formatted}
          onChange={handleChange}
          placeholder="total_reviews_formatted"
          required
        />
        <input
          name="lastmerchantreviewid"
          value={form.lastmerchantreviewid}
          onChange={handleChange}
          placeholder="lastmerchantreviewid"
          required
        />
        <input
          name="reviewscount"
          value={form.reviewscount}
          onChange={handleChange}
          placeholder="reviewscount"
          required
        />
        <input
          name="lastupdated"
          value={form.lastupdated}
          onChange={handleChange}
          placeholder="lastupdated"
          required
        />
        <input
          name="total_google_eligible"
          value={form.total_google_eligible}
          onChange={handleChange}
          placeholder="total_google_eligible"
          required
        />
        <input
          name="average_rating"
          value={form.average_rating}
          onChange={handleChange}
          placeholder="average_rating"
          required
        />
        <input
          name="fivestar"
          value={form.fivestar}
          onChange={handleChange}
          placeholder="fivestar"
          required
        />
        <input
          name="fourstar"
          value={form.fourstar}
          onChange={handleChange}
          placeholder="fourstar"
          required
        />
        <input
          name="threestar"
          value={form.threestar}
          onChange={handleChange}
          placeholder="threestar"
          required
        />
        <input
          name="twostar"
          value={form.twostar}
          onChange={handleChange}
          placeholder="twostar"
          required
        />
        <input
          name="onestar"
          value={form.onestar}
          onChange={handleChange}
          placeholder="onestary"
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

export default AddEditReviewStatsForm;
