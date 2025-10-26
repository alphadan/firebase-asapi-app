import { useState } from "react";
import FirestoreDBService from "../FirestoreDBService.js";

function AddEditReviewStatsForm({ handleSetDocument }) {
  const [reviewstatsid, setReviewStatsId] = useState("");
  const [totalreviews, setTotalReviews] = useState("");
  const [totalreviewsformatted, setTotalReviewsFormatted] = useState("");
  const [totalgoogleeligible, setTotalGoogleEligible] = useState("");
  const [averagerating, setAverageRating] = useState("");
  const [reviewscount, setReviewsCount] = useState("");
  const [lastmerchantreviewid, setLastMerchantReviewId] = useState("");
  const [lastupdated, setLastUpdated] = useState("");
  const [fivestar, setFiveStar] = useState("");
  const [fourstar, setFourStar] = useState("");
  const [threestar, setThreeStar] = useState("");
  const [twostar, setTwoStar] = useState("");
  const [onestar, setOneStar] = useState("");
  const [reviewstatskey, setReviewStatsKey] = useState("");

  async function handleGetReviewStats() {
    const folder = "reviewstats";
    const queries = [];
    const queryvendorcode = document.getElementById("reviewstatsidinput").value;

    queries.push({
      field: "reviewstatsid",
      condition: "==",
      value: queryvendorcode,
    });

    const querySnapshot = await FirestoreDBService.readCurrentItem(
      folder,
      queries
    );

    querySnapshot.forEach((doc) => {
      setReviewStatsKey(doc.id);
      setReviewStatsId(doc.get("reviewstatsid"));
      setTotalReviews(doc.get("total_reviews"));
      setTotalReviewsFormatted(doc.get("total_reviews_formatted"));
      setReviewsCount(doc.get("reviewscount"));
      setLastMerchantReviewId(doc.get("lastmerchantreviewid"));
      setLastUpdated(doc.get("lastupdated"));
      setTotalGoogleEligible(doc.get("total_google_eligible"));
      setAverageRating(doc.get("average_rating"));
      setFiveStar(doc.get("fivestar"));
      setFourStar(doc.get("fourstar"));
      setThreeStar(doc.get("threestar"));
      setTwoStar(doc.get("twostar"));
      setOneStar(doc.get("onestar"));
    });
  }

  function handleUpdateReviewStatsSubmit(e) {
    e.preventDefault();
    const folder = "reviewstats";
    const setid = document.getElementById("reviewstatskeyinput").value;

    const newDocument = {
      reviewstatsid: reviewstatsid,
      total_reviews: totalreviews,
      total_reviews_formatted: totalreviewsformatted,
      reviewscount: reviewscount,
      lastmerchantreviewid: lastmerchantreviewid,
      lastupdated: lastupdated,
      total_google_eligible: totalgoogleeligible,
      average_rating: averagerating,
      fivestar: fivestar,
      fourstar: fourstar,
      threestar: threestar,
      twostar: twostar,
      onestar: onestar,
    };

    handleSetDocument(folder, setid, newDocument);

    resetForm();
  }

  function handleEditReviewStatsCancel() {
    resetForm();
  }

  function resetForm() {
    setReviewStatsId("");
    setTotalReviews("");
    setTotalReviewsFormatted("");
    setTotalGoogleEligible("");
    setAverageRating("");
    setReviewsCount("");
    setLastMerchantReviewId("");
    setLastUpdated("");
    setFiveStar("");
    setFourStar("");
    setThreeStar("");
    setTwoStar("");
    setOneStar("");
  }

  return (
    <div className="main">
      <div className="center">
        <div className="recipe-list-box">
          <div className="recipe-list">
            <div className="recipe-card">
              <form className="add-edit-recipe-form-container">
                <h2>Search Review Stats</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Statistic Id:
                      <input
                        id="reviewstatsidinput"
                        type="text"
                        required
                        className="input-text"
                        value={reviewstatsid}
                        onChange={(e) => setReviewStatsId(1)}
                      />
                    </label>

                    <button
                      type="button"
                      className="primary-button edit-button"
                      onClick={handleGetReviewStats}
                    >
                      Get Review Stats
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form
                onSubmit={handleUpdateReviewStatsSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Update Review Stats</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Id:
                      <input
                        type="text"
                        required
                        readOnly
                        value={reviewstatsid}
                        onChange={(e) => setReviewStatsId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Total Reviews:
                      <input
                        type="text"
                        required
                        value={totalreviews}
                        onChange={(e) => setTotalReviews(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Total Reviews Formatted:
                      <input
                        type="text"
                        required
                        value={totalreviewsformatted}
                        onChange={(e) =>
                          setTotalReviewsFormatted(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Reviews Count:
                      <input
                        type="text"
                        required
                        value={reviewscount}
                        onChange={(e) => setReviewsCount(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Last Merchant ReviewId:
                      <input
                        type="text"
                        required
                        value={lastmerchantreviewid}
                        onChange={(e) =>
                          setLastMerchantReviewId(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Last Updated:
                      <input
                        type="text"
                        required
                        value={lastupdated}
                        onChange={(e) => setLastUpdated(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Total Google Eligible:
                      <input
                        type="text"
                        required
                        value={totalgoogleeligible}
                        onChange={(e) => setTotalGoogleEligible(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Average Rating:
                      <input
                        type="text"
                        required
                        value={averagerating}
                        onChange={(e) => setAverageRating(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Reviews Count:
                      <input
                        type="text"
                        required
                        value={reviewscount}
                        onChange={(e) => setReviewsCount(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Five Star:
                      <input
                        type="text"
                        required
                        value={fivestar}
                        onChange={(e) => setFiveStar(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Four Star:
                      <input
                        type="text"
                        required
                        value={fourstar}
                        onChange={(e) => setFourStar(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Three Star:
                      <input
                        type="text"
                        required
                        value={threestar}
                        onChange={(e) => setThreeStar(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Two Star:
                      <input
                        type="text"
                        required
                        value={twostar}
                        onChange={(e) => setTwoStar(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      One Star:
                      <input
                        type="text"
                        required
                        value={onestar}
                        onChange={(e) => setOneStar(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Key:
                      <input
                        id="reviewstatskeyinput"
                        type="text"
                        required
                        readOnly
                        value={reviewstatskey}
                        onChange={(e) => setReviewStatsKey(e.target.value)}
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
                      onClick={handleEditReviewStatsCancel}
                      className="primary-button action-button"
                    >
                      Cancel
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

export default AddEditReviewStatsForm;
