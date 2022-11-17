import { useState } from "react";
import FirestoreDBService from "../FirestoreDBService.js";

function AddEditReviewsForm({
  handleAddDocument,
  handleSetDocument,
  handleDeleteDocument,
}) {
  const [reviewid, setReviewId] = useState("");
  const [reviewpageid, setReviewPageId] = useState("");
  const [reviewmerchantreviewid, setReviewMerchantReviewId] = useState("");
  const [reviewstatus, setReviewStatus] = useState("");
  const [reviewcreatedate, setReviewCreateDate] = useState("");
  const [reviewconfirmstatus, setReviewConfirmStatus] = useState("");
  const [reviewheadline, setReviewHeadline] = useState("");
  const [reviewoverallrating, setReviewOverallRating] = useState("");
  const [reviewbottomline, setReviewBottomline] = useState("");
  const [reviewcomments, setReviewComments] = useState("");
  const [reviewnickname, setReviewNickname] = useState("");
  const [reviewlocation, setReviewLocation] = useState("");
  const [reviewservicecomments, setReviewServiceComments] = useState("");
  const [reviewcustomerimage, setReviewCustomerImage] = useState("");
  const [reviewcaption, setReviewCaption] = useState("");
  const [reviewfullimagelocation, setReviewFullImageLocation] = useState("");
  const [reviewthumbnaillocation, setReviewThumbnailLocation] = useState("");
  const [reviewpictag, setReviewPictag] = useState("");
  const [reviewlanguage, setReviewLanguage] = useState("");
  const [revieworderid, setReviewOrderid] = useState("");
  const [reviewprivate, setReviewPrivate] = useState("");
  const [reviewresponse, setReviewResponse] = useState("");
  const [reviewkey, setReviewKey] = useState("");
  const [currentreviewid, setCurrentReviewId] = useState("");
  const [currentreviewpageid, setCurrentReviewPageId] = useState("");
  const [currentreviewmerchantreviewid, setCurrentReviewMerchantReviewId] =
    useState("");
  const [currentreviewstatus, setCurrentReviewStatus] = useState("");
  const [currentreviewcreatedate, setCurrentReviewCreateDate] = useState("");
  const [currentreviewconfirmstatus, setCurrentReviewConfirmStatus] =
    useState("");
  const [currentreviewheadline, setCurrentReviewHeadline] = useState("");
  const [currentreviewoverallrating, setCurrentReviewOverallRating] =
    useState("");
  const [currentreviewbottomline, setCurrentReviewBottomline] = useState("");
  const [currentreviewcomments, setCurrentReviewComments] = useState("");
  const [currentreviewnickname, setCurrentReviewNickname] = useState("");
  const [currentreviewlocation, setCurrentReviewLocation] = useState("");
  const [currentreviewservicecomments, setCurrentReviewServiceComments] =
    useState("");
  const [currentreviewcustomerimage, setCurrentReviewCustomerImage] =
    useState("");
  const [currentreviewcaption, setCurrentReviewCaption] = useState("");
  const [currentreviewfullimagelocation, setCurrentReviewFullImageLocation] =
    useState("");
  const [currentreviewthumbnaillocation, setCurrentReviewThumbnailLocation] =
    useState("");
  const [currentreviewpictag, setCurrentReviewPictag] = useState("");
  const [currentreviewlanguage, setCurrentReviewLanguage] = useState("");
  const [currentrevieworderid, setCurrentReviewOrderid] = useState("");
  const [currentreviewprivate, setCurrentReviewPrivate] = useState("");
  const [currentreviewresponse, setCurrentReviewResponse] = useState("");
  const [currentreviewkey, setCurrentReviewKey] = useState("");

  function handleReviewFormSubmit(e) {
    e.preventDefault();
    const folder = "reviews";
    const formname = "addreview";

    const newDocument = {
      reviewid,
      reviewpageid,
      reviewmerchantreviewid,
      reviewstatus,
      reviewcreatedate,
      reviewconfirmstatus,
      reviewheadline,
      reviewoverallrating,
      reviewbottomline,
      reviewcomments,
      reviewnickname,
      reviewlocation,
      reviewservicecomments,
      reviewcustomerimage,
      reviewcaption,
      reviewfullimagelocation,
      reviewthumbnaillocation,
      reviewpictag,
      reviewlanguage,
      revieworderid,
      reviewprivate,
      reviewresponse,
    };

    handleAddDocument(folder, newDocument);
    resetForm(formname);
  }

  async function handleGetCurrentReview() {
    const folder = "reviews";
    const queries = [];
    const queryreviewid = document.getElementById("reviewidinput").value;

    queries.push({
      field: "reviewid",
      condition: "==",
      value: queryreviewid,
    });

    const querySnapshot = await FirestoreDBService.readCurrentItem(
      folder,
      queries
    );

    querySnapshot.forEach((doc) => {
      setCurrentReviewKey(doc.get("key"));
      setCurrentReviewId(doc.get("reviewid"));
      setCurrentReviewPageId(doc.get("reviewpageid"));
      setCurrentReviewMerchantReviewId(doc.get("reviewmerchantreviewid"));
      setCurrentReviewStatus(doc.get("reviewstatus"));
      setCurrentReviewCreateDate(doc.get("reviewcreatedate"));
      setCurrentReviewConfirmStatus(doc.get("reviewconfirmstatus"));
      setCurrentReviewHeadline(doc.get("reviewheadline"));
      setCurrentReviewOverallRating(doc.get("reviewoverallrating"));
      setCurrentReviewBottomline(doc.get("reviewbottomline"));
      setCurrentReviewComments(doc.get("reviewcomments"));
      setCurrentReviewNickname(doc.get("reviewnickname"));
      setCurrentReviewLocation(doc.get("reviewlocation"));
      setCurrentReviewServiceComments(doc.get("reviewservicecomments"));
      setCurrentReviewCustomerImage(doc.get("reviewcustomerimage"));
      setCurrentReviewCaption(doc.get("creviewaption"));
      setCurrentReviewFullImageLocation(doc.get("reviewfullimagelocation"));
      setCurrentReviewThumbnailLocation(doc.get("reviewthumbnaillocation"));
      setCurrentReviewPictag(doc.get("reviewpictag"));
      setCurrentReviewLanguage(doc.get("reviewlanguage"));
      setCurrentReviewOrderid(doc.get("revieworderid"));
      setCurrentReviewPrivate(doc.get("reviewprivate"));
      setCurrentReviewResponse(doc.get("reviewresponse"));
    });
  }

  function handleUpdateReviewFormSubmit(e) {
    e.preventDefault();
    const folder = "reviews";
    const setid = document.getElementById("currentreviewidinput").value;
    const formname = "updatereview";

    const newDocument = {
      reviewid: currentreviewid,
      reviewpageid: currentreviewpageid,
      reveiwmerchantreviewid: currentreviewmerchantreviewid,
      reviewstatus: currentreviewstatus,
      reviewcreatedate: currentreviewcreatedate,
      reviewconfirmstatus: currentreviewconfirmstatus,
      reviewheadline: currentreviewheadline,
      reviewoverallrating: currentreviewoverallrating,
      reviewbottomline: currentreviewbottomline,
      reviewcomments: currentreviewcomments,
      reviewnickname: currentreviewnickname,
      reviewlocation: currentreviewlocation,
      reviewservicecomments: currentreviewservicecomments,
      reviewcustomerimage: currentreviewcustomerimage,
      reveiwcaption: currentreviewcaption,
      reviewfullimagelocation: currentreviewfullimagelocation,
      reviewcthumbnaillocation: currentreviewthumbnaillocation,
      reviewpictag: currentreviewpictag,
      reviewlanguage: currentreviewlanguage,
      revieworderid: currentrevieworderid,
      reviewprivate: currentreviewprivate,
      reviewresponse: currentreviewresponse,
    };

    handleSetDocument(folder, setid, newDocument);

    resetForm(formname);
  }

  function handleEditReviewCancel() {
    const formname = "updatereview";
    resetForm(formname);
  }

  function handleDeleteReviewSubmit(currentreviewid) {
    const folder = "reviews";
    const deleteid = document.getElementById("currentvendoridinput").value;
    const formname = "updatereview";
    console.log("currentreviewid", currentreviewid);

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
    if (formname === "addreview") {
      setReviewKey("");
      setReviewId("");
      setReviewPageId("");
      setReviewMerchantReviewId("");
      setReviewStatus("");
      setReviewCreateDate("");
      setReviewConfirmStatus("");
      setReviewHeadline("");
      setReviewOverallRating("");
      setReviewBottomline("");
      setReviewComments("");
      setReviewNickname("");
      setReviewLocation("");
      setReviewServiceComments("");
      setReviewCustomerImage("");
      setReviewCaption("");
      setReviewFullImageLocation("");
      setReviewThumbnailLocation("");
      setReviewPictag("");
      setReviewLanguage("");
      setReviewOrderid("");
      setReviewPrivate("");
      setReviewResponse("");
    } else {
      setCurrentReviewKey("");
      setCurrentReviewId("");
      setCurrentReviewPageId("");
      setCurrentReviewMerchantReviewId("");
      setCurrentReviewStatus("");
      setCurrentReviewCreateDate("");
      setCurrentReviewConfirmStatus("");
      setCurrentReviewHeadline("");
      setCurrentReviewOverallRating("");
      setCurrentReviewBottomline("");
      setCurrentReviewComments("");
      setCurrentReviewNickname("");
      setCurrentReviewLocation("");
      setCurrentReviewServiceComments("");
      setCurrentReviewCustomerImage("");
      setCurrentReviewCaption("");
      setCurrentReviewFullImageLocation("");
      setCurrentReviewThumbnailLocation("");
      setCurrentReviewPictag("");
      setCurrentReviewLanguage("");
      setCurrentReviewOrderid("");
      setCurrentReviewPrivate("");
      setCurrentReviewResponse("");
    }
  }

  return (
    <div className="main">
      <div className="center">
        <div className="recipe-list-box">
          <div className="recipe-list">
            <div className="recipe-card">
              <form
                onSubmit={handleReviewFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Add New Review</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Id:
                      <input
                        type="text"
                        required
                        value={reviewid}
                        onChange={(e) => setReviewId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Pageid:
                      <input
                        type="text"
                        required
                        value={reviewpageid}
                        onChange={(e) => setReviewPageId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Merchant Review Id:
                      <input
                        type="text"
                        required
                        value={reviewmerchantreviewid}
                        onChange={(e) =>
                          setReviewMerchantReviewId(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Status:
                      <input
                        type="text"
                        required
                        value={reviewstatus}
                        onChange={(e) => setReviewStatus(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Createdate:
                      <input
                        type="text"
                        required
                        value={reviewcreatedate}
                        onChange={(e) => setReviewCreateDate(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Confirm Status:
                      <input
                        type="text"
                        required
                        value={reviewconfirmstatus}
                        onChange={(e) => setReviewConfirmStatus(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Headline:
                      <input
                        type="text"
                        required
                        value={reviewheadline}
                        onChange={(e) => setReviewHeadline(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Overall Rating:
                      <input
                        type="text"
                        required
                        value={reviewoverallrating}
                        onChange={(e) => setReviewOverallRating(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Bottomline:
                      <input
                        type="text"
                        required
                        value={reviewbottomline}
                        onChange={(e) => setReviewBottomline(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Comments:
                      <input
                        type="text"
                        required
                        value={reviewcomments}
                        onChange={(e) => setReviewComments(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Nickname:
                      <input
                        type="text"
                        required
                        value={reviewnickname}
                        onChange={(e) => setReviewNickname(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Location:
                      <input
                        type="text"
                        required
                        value={reviewlocation}
                        onChange={(e) => setReviewLocation(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Service Comments:
                      <input
                        type="text"
                        required
                        value={reviewservicecomments}
                        onChange={(e) =>
                          setReviewServiceComments(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Customer Image:
                      <input
                        type="text"
                        required
                        value={reviewcustomerimage}
                        onChange={(e) => setReviewCustomerImage(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Caption:
                      <input
                        type="text"
                        required
                        value={reviewcaption}
                        onChange={(e) => setReviewCaption(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Full Image Location:
                      <input
                        type="text"
                        required
                        value={reviewfullimagelocation}
                        onChange={(e) =>
                          setReviewFullImageLocation(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Thumbnail Location:
                      <input
                        type="text"
                        required
                        value={reviewthumbnaillocation}
                        onChange={(e) =>
                          setReviewThumbnailLocation(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Pictag:
                      <input
                        type="text"
                        required
                        value={reviewpictag}
                        onChange={(e) => setReviewPictag(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Language:
                      <input
                        type="text"
                        required
                        value={reviewlanguage}
                        onChange={(e) => setReviewLanguage(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Order Id:
                      <input
                        type="text"
                        required
                        value={revieworderid}
                        onChange={(e) => setReviewOrderid(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Private:
                      <input
                        type="text"
                        required
                        value={reviewprivate}
                        onChange={(e) => setReviewPrivate(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Response:
                      <input
                        type="text"
                        required
                        value={reviewresponse}
                        onChange={(e) => setReviewResponse(e.target.value)}
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
                    Add Review
                  </button>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form className="add-edit-recipe-form-container">
                <h2>Search Review</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Review Id:
                      <input
                        id="reviewidinput"
                        type="text"
                        required
                        className="input-text"
                        value={currentreviewid}
                        onChange={(e) => setCurrentReviewId(e.target.value)}
                      />
                    </label>

                    <button
                      type="button"
                      className="primary-button edit-button"
                      onClick={handleGetCurrentReview}
                    >
                      Get Review
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="recipe-card">
              <form
                onSubmit={handleUpdateReviewFormSubmit}
                className="add-edit-recipe-form-container"
              >
                <h2>Update Review</h2>
                <div className="top-form-section">
                  <div className="fields">
                    <label className="recipe-label input-label">
                      Id:
                      <input
                        type="text"
                        required
                        readOnly
                        value={currentreviewid}
                        onChange={(e) => setCurrentReviewId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Pageid:
                      <input
                        type="text"
                        required
                        value={currentreviewpageid}
                        onChange={(e) => setCurrentReviewPageId(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Merchant Review Id:
                      <input
                        type="text"
                        required
                        value={currentreviewmerchantreviewid}
                        onChange={(e) =>
                          setCurrentReviewMerchantReviewId(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Status:
                      <input
                        type="text"
                        required
                        value={currentreviewstatus}
                        onChange={(e) => setCurrentReviewStatus(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Createdate:
                      <input
                        type="text"
                        required
                        value={currentreviewcreatedate}
                        onChange={(e) =>
                          setCurrentReviewCreateDate(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Confirm Status:
                      <input
                        type="text"
                        required
                        value={currentreviewconfirmstatus}
                        onChange={(e) =>
                          setCurrentReviewConfirmStatus(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Headline:
                      <input
                        type="text"
                        required
                        value={currentreviewheadline}
                        onChange={(e) =>
                          setCurrentReviewHeadline(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Overall Rating:
                      <input
                        type="text"
                        required
                        value={currentreviewoverallrating}
                        onChange={(e) =>
                          setCurrentReviewOverallRating(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Bottomline:
                      <input
                        type="text"
                        required
                        value={currentreviewbottomline}
                        onChange={(e) =>
                          setCurrentReviewBottomline(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Comments:
                      <input
                        type="text"
                        required
                        value={currentreviewcomments}
                        onChange={(e) =>
                          setCurrentReviewComments(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Nickname:
                      <input
                        type="text"
                        required
                        value={currentreviewnickname}
                        onChange={(e) =>
                          setCurrentReviewNickname(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Location:
                      <input
                        type="text"
                        required
                        value={currentreviewlocation}
                        onChange={(e) =>
                          setCurrentReviewLocation(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Service Comments:
                      <input
                        type="text"
                        required
                        value={currentreviewservicecomments}
                        onChange={(e) =>
                          setCurrentReviewServiceComments(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Customer Image:
                      <input
                        type="text"
                        required
                        value={currentreviewcustomerimage}
                        onChange={(e) =>
                          setCurrentReviewCustomerImage(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Caption:
                      <input
                        type="text"
                        required
                        value={currentreviewcaption}
                        onChange={(e) =>
                          setCurrentReviewCaption(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Full Image Location:
                      <input
                        type="text"
                        required
                        value={currentreviewfullimagelocation}
                        onChange={(e) =>
                          setCurrentReviewFullImageLocation(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Thumbnail Location:
                      <input
                        type="text"
                        required
                        value={currentreviewthumbnaillocation}
                        onChange={(e) =>
                          setCurrentReviewThumbnailLocation(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Pictag:
                      <input
                        type="text"
                        required
                        value={currentreviewpictag}
                        onChange={(e) => setCurrentReviewPictag(e.target.value)}
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Language:
                      <input
                        type="text"
                        required
                        value={currentreviewlanguage}
                        onChange={(e) =>
                          setCurrentReviewLanguage(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Order Id:
                      <input
                        type="text"
                        required
                        value={currentrevieworderid}
                        onChange={(e) =>
                          setCurrentReviewOrderid(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Private:
                      <input
                        type="text"
                        required
                        value={currentreviewprivate}
                        onChange={(e) =>
                          setCurrentReviewPrivate(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Response:
                      <input
                        type="text"
                        required
                        value={currentreviewresponse}
                        onChange={(e) =>
                          setCurrentReviewResponse(e.target.value)
                        }
                        className="input-text"
                      />
                    </label>
                    <label className="recipe-label input-label">
                      Key:
                      <input
                        type="text"
                        required
                        readOnly
                        value={currentreviewkey}
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
                      onClick={handleEditReviewCancel}
                      className="primary-button action-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteReviewSubmit}
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

export default AddEditReviewsForm;
