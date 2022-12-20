// VERSION 8
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const apiFirebaseOptions = {
  ...functions.config().firebase,
  credential: admin.credential.applicationDefault(),
};

admin.initializeApp(apiFirebaseOptions);

const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };

firestore.settings(settings);

const fetch = require("node-fetch");

// const auth = admin.auth();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/readDocuments", async (req, res) => {
  let orderByField = "";
  if (req.body.folder) {
    switch (req.body.folder) {
      case "vendors":
        orderByField = "vendorname";
        break;
      case "reviewstats":
        orderByField = "reviewstatsid";
        break;
      case "shipoverride":
        orderByField = "productcode";
        break;
      case "reviews":
        orderByField = "reviewid";
        break;
      default:
        break;
    }
  }
  try {
    let firestoreResponse = "";
    if (req.body.queries && req.body.orderByDirection) {
      firestoreResponse = await firestore
        .collection(req.body.folder)
        .where(
          req.body.queries.field,
          req.body.queries.condition,
          req.body.queries.value
        )
        .orderBy(orderByField, req.body.orderByDirection)
        .get();
    } else if (req.body.queries) {
      firestoreResponse = await firestore
        .collection(req.body.folder)
        .where(
          req.body.queries.field,
          req.body.queries.condition,
          req.body.queries.value
        )
        .get();
    } else if (req.body.orderByDirection) {
      firestoreResponse = await firestore
        .collection(req.body.folder)
        .orderBy(orderByField, req.body.orderByDirection)
        .get();
    } else {
      firestoreResponse = await firestore.collection(req.body.folder).get();
    }
    const fetchedData = firestoreResponse.docs.map((doc) => {
      const data = doc.data();

      return { ...data };
    });

    const payload = {
      fetchedData,
    };

    res.status(200).send(payload);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/readDocuments", async (req, res) => {
  const queryObject = req.query;
  const folder = queryObject["folder"] ? queryObject["folder"] : "";
  const orderByDirection = queryObject["orderByDirection"]
    ? queryObject["orderByDirection"]
    : null;
  const field = queryObject["field"] ? queryObject["field"] : null;
  const condition = "==";
  const value = queryObject["value"] ? queryObject["value"] : "";

  let orderByField = "";
  if (folder) {
    switch (folder) {
      case "vendors":
        orderByField = "vendorname";
        break;
      case "reviewstats":
        orderByField = "reviewstatsid";
        break;
      case "shipoverride":
        orderByField = "productcode";
        break;
      case "reviews":
        orderByField = "reviewid";
        break;
      default:
        break;
    }
  }
  try {
    let firestoreResponse = "";
    if (folder && field && orderByDirection) {
      firestoreResponse = await firestore
        .collection(folder)
        .where(field, condition, value)
        .orderBy(orderByField, orderByDirection)
        .get();
    } else if (field) {
      firestoreResponse = await firestore
        .collection(folder)
        .where(field, condition, value)
        .get();
    } else if (orderByDirection) {
      firestoreResponse = await firestore
        .collection(folder)
        .orderBy(orderByField, orderByDirection)
        .get();
    } else {
      firestoreResponse = await firestore.collection(folder).get();
    }
    const fetchedData = firestoreResponse.docs.map((doc) => {
      const data = doc.data();

      return { ...data };
    });

    const payload = {
      fetchedData,
    };

    res.status(200).send(payload);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/readProductReviews", async (req, res) => {
  const folder = "reviews";
  const queryObject = req.query;
  const prodcode = queryObject["prodcode"] ? queryObject["prodcode"] : "";
  let limit = queryObject["limit"] ? queryObject["limit"] : "24";
  limit = Number(limit);

  let orderByDirection = "desc";
  let orderByField = "";
  if (folder) {
    switch (folder) {
      case "reviews":
        orderByField = "reviewid";
        break;
      default:
        break;
    }
  }
  try {
    let firestoreResponse = "";
    firestoreResponse = await firestore
      .collection(folder)
      .where("reviewpageid", "==", prodcode)
      .orderBy(orderByField, orderByDirection)
      .limit(limit)
      .get();

    const fetchedData = firestoreResponse.docs.map((doc) => {
      const data = doc.data();

      return { ...data };
    });

    const payload = {
      fetchedData,
    };

    res.status(200).send(payload);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/readRecentReviews", async (req, res) => {
  const folder = "recentreviews";

  let orderByDirection = "desc";
  let orderByField = "";
  if (folder) {
    switch (folder) {
      case "recentreviews":
        orderByField = "reviewid";
        break;
      default:
        break;
    }
  }
  try {
    let firestoreResponse = "";
    firestoreResponse = await firestore
      .collection(folder)
      .orderBy(orderByField, orderByDirection)
      .get();

    const fetchedData = firestoreResponse.docs.map((doc) => {
      const data = doc.data();

      return { ...data };
    });

    const payload = {
      fetchedData,
    };

    res.status(200).send(payload);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/setReviews", async (req, res) => {
  const newDocument = {
    reviewid: req.body.reviewid,
    reviewpageid: req.body.reviewpageid,
    reviewmerchantreviewid: req.body.reviewmerchantreviewid,
    reviewstatus: req.body.reviewstatus,
    reviewcreatedate: req.body.reviewcreatedate,
    reviewconfirmstatus: req.body.reviewconfirmstatus,
    reviewheadline: req.body.reviewheadline,
    reviewoverallrating: req.body.reviewoverallrating,
    reviewbottomline: req.body.reviewbottomline,
    reviewcomments: req.body.reviewcomments,
    reviewnickname: req.body.reviewnickname,
    reviewlocation: req.body.reviewlocation,
    reviewservicecomments: req.body.reviewservicecomments,
    reviewcustomerimage: req.body.reviewcustomerimage,
    reviewcaption: req.body.reviewcaption,
    reviewfullimagelocation: req.body.reviewfullimagelocation,
    reviewthumbnaillocation: req.body.reviewthumbnaillocation,
    reviewpictag: null,
    reviewlanguage: "en",
    revieworderid: req.body.revieworderid,
    reviewprivate: null,
    reviewreponse: req.body.reviewreponse,
  };

  let folder = "blogposts";
  let reviews = "";
  reviews = require("./files/reviewsStaging.json");

  const createNewDocBatch = async (reviews) => {
    try {
      const batch = firestore.batch();
      reviews.forEach((review) => {
        let docRef = firestore.collection(folder).doc();
        let b = Buffer.from(review.postcontent, "base64");
        review.postcontent = b.toString();
        // let reviewObj = JSON.parse(JSON.stringify(review));
        batch.set(docRef, review);
      });
      batch.commit();
    } catch (error) {
      functions.logger.error(error.message);
      res.status(400).send("done with error");
    }
  };

  await createNewDocBatch(reviews);
  res.status(200).send(" ...done");
});

app.post("/updateReviews", async (req, res) => {
  let newReviews = {};
  let reviewsdata = {};
  let reviewscount = 0;
  let reviewstats = {};

  const getLastQueryDate = async () => {
    reviewsdata = await firestore
      .collection("reviewstats")
      .doc("XeMc8VdY9hdiBqX5kLjJ")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.data();
      })
      .catch((error) => {
        functions.logger.log("[getLastQueryDate.error ]" + error);
      });
    return reviewsdata;
  };

  const saNewReviews = async (lastQueryDate) => {
    let saurl =
      "https://api.shopperapproved.com/products/reviews/23071?token=twbKPczT&from=" +
      lastQueryDate +
      "&sort=oldest&xml=false";
    const response = await fetch(saurl);
    const data = await response.json();
    return data;
  };

  const insertNewReviews = async (
    newReviews,
    reviewscount,
    lastMerchantReviewId
  ) => {
    let folder = "reviews";
    let currentMerchantReviewId = 0;
    const createNewDocBatch = async (
      newReviews,
      reviewscount,
      lastMerchantReviewId
    ) => {
      try {
        const batch = firestore.batch();
        for (const key in newReviews) {
          if (key > lastMerchantReviewId) {
            currentMerchantReviewId = lastMerchantReviewId;
            reviewscount = reviewscount + 1;
            let year = new Date(newReviews[key].review_date).getFullYear();
            let month = new Date(newReviews[key].review_date).getMonth();
            let date = new Date(newReviews[key].review_date).getDate();
            let review_date_string = year + "-" + month + "-" + date;
            let newDocument = {
              reviewid: reviewscount.toString(),
              reviewindex: Number(reviewscount),
              reviewmerchantreviewid: key.toString(),
              reviewnickname: newReviews[key].display_name,
              revieworderid: newReviews[key].order_id,
              reviewcreatedate: review_date_string,
              reviewpageid: newReviews[key].product_id,
              reviewoverallrating: newReviews[key].rating,
              reviewcomments: newReviews[key].comments,
              reviewheadline: newReviews[key].heading,
              reviewstatus: "Approved",
              reviewconfirmstatus: "Verified Buyer",
              reviewresponse: null,
              reviewlanguage: "en",
              reviewlocation: newReviews[key].location,
            };
            let docRef = firestore.collection(folder).doc();
            batch.set(docRef, newDocument);
          }
        }
        batch.commit();
      } catch (error) {
        functions.logger.error(error.message);
        res.status(400).send("done with error");
      }
    };

    await createNewDocBatch(newReviews, reviewscount, lastMerchantReviewId);
    reviewstats = {
      reviewscount: reviewscount,
      lastMerchantReviewId: currentMerchantReviewId,
    };
    return reviewstats;
  };

  const updateReviewsStats = async (reviewscount, lastMerchantReviewId) => {
    let firestoreResponse = firestore
      .collection("reviewstats")
      .doc("XeMc8VdY9hdiBqX5kLjJ");
    const year = new Date().getFullYear();
    let month = new Date().getMonth();
    month = +month;
    const date = new Date().getDate();
    const lastquerydate = year + "-" + month + "-" + date;
    const setWithMerge = firestoreResponse.set(
      {
        reviewscount: reviewscount,
        lastquerydate: lastquerydate.toString(),
        lastmerchantreviewid: lastMerchantReviewId,
      },
      { merge: true }
    );
    return 1;
  };

  const init = async () => {
    reviewsdata = await getLastQueryDate();
    let lastQueryDate = reviewsdata.lastquerydate;
    reviewscount = reviewsdata.reviewscount;
    let lastMerchantReviewId = reviewsdata.lastmerchantreviewid;
    newReviews = await saNewReviews(lastQueryDate);
    reviewstats = await insertNewReviews(
      newReviews,
      reviewscount,
      lastMerchantReviewId
    );
    functions.logger.log("[init]:reviewcount " + reviewstats.reviewscount);
    functions.logger.log(
      "[init]:lastMerchantReviewId " + reviewstats.lastMerchantReviewId
    );
    await updateReviewsStats(
      reviewstats.reviewscount,
      reviewstats.lastMerchantReviewId
    );
    res.status(200).send("done " + reviewscount);
  };

  init();
});

app.post("/updateRecentReviews", async (req, res) => {
  const getRecentReviews = async () => {
    const folder = "reviews";
    let limit = 10;
    let orderByDirection = "desc";
    let orderByField = "reviewindex";

    try {
      let firestoreResponse = "";
      firestoreResponse = await firestore
        .collection(folder)
        .orderBy(orderByField, orderByDirection)
        .limit(limit)
        .get();
      functions.logger.log("[getRecentReviews ]" + firestoreResponse);
      return firestoreResponse.docs.map((doc) => doc.data());
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  const deleteRecentReviewsCollection = async () => {
    const collectionRef = firestore.collection("recentreviews");
    const snapshot = await collectionRef.get();
    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return;
  };

  const insertNewRecentReviews = async (recentreviews) => {
    let folder = "recentreviews";
    const createNewDocBatch = async (recentreviews) => {
      try {
        const batch = firestore.batch();
        recentreviews.forEach((doc) => {
          let docRef = firestore.collection(folder).doc();
          batch.set(docRef, doc);
        });
        batch.commit();
      } catch (error) {
        functions.logger.error(error.message);
        res.status(400).send("done with error");
      }
    };
    await createNewDocBatch(recentreviews);
    return;
  };

  const init = async () => {
    let recentreviews = await getRecentReviews();
    await deleteRecentReviewsCollection();
    await insertNewRecentReviews(recentreviews);
    res.status(200).send(recentreviews);
  };

  init();
});

app.get("/prodSummary", async (req, res) => {
  const queryObject = req.query;
  const productcode = queryObject["productcode"];
  let saurl =
    "https://api.shopperapproved.com/aggregates/products/23071/" +
    productcode +
    "?token=twbKPczT&xml=false";
  const response = await fetch(saurl);
  const data = await response.json();
  const prodSummary = {
    total_reviews: data.product_totals.total_reviews,
    average_rating: data.product_totals.average_rating,
  };
  res.status(200).send(prodSummary);
});

app.get("/readReviewStats", async (req, res) => {
  let saurl =
    "https://api.shopperapproved.com/aggregates/reviews/23071?token=twbKPczT&xml=false";
  functions.logger.log(saurl);
  const response = await fetch(saurl);
  const data = await response.json();
  const reviewStats = {
    total_reviews: data.total_reviews,
    average_rating: data.average_rating,
  };
  res.status(200).send(reviewStats);
});

app.get("/updateReviewFields", async (req, res) => {
  const folder = "reviews";

  let orderByDirection = "desc";
  let orderByField = "";
  if (folder) {
    switch (folder) {
      case "recentreviews":
        orderByField = "reviewid";
        break;
      default:
        break;
    }
  }
  try {
    let firestoreResponse = "";
    firestoreResponse = await firestore
      .collection(folder)
      .orderBy(orderByField, orderByDirection)
      .get();

    const fetchedData = firestoreResponse.docs.map((doc) => {
      const data = doc.data();

      return { ...data };
    });

    const payload = {
      fetchedData,
    };

    res.status(200).send(payload);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/readBlogCategories", async (req, res) => {
  // const folder = "blogcategories";
  const queryObject = req.query;
  const blogfolder = queryObject["blogfolder"]
    ? queryObject["blogfolder"]
    : "blogcategories";
  const bloguri = queryObject["bloguri"] ? queryObject["bloguri"] : "";
  const newscategoryid = queryObject["newscategoryid"]
    ? queryObject["newscategoryid"]
    : "";
  let orderByField = "";

  let orderByDirection = "asc";

  if (blogfolder === "blogcategories") {
    orderByField = "blogcategoryname";
  } else {
    orderByField = "newscategoryname";
  }

  functions.logger.log("bloguri.length: ", bloguri.length);

  try {
    let firestoreResponse = "";
    if (bloguri.length && blogfolder === "blogcategories") {
      firestoreResponse = await firestore
        .collection(blogfolder)
        .where("bloguri", "==", bloguri)
        .get();
    } else if (newscategoryid.length && blogfolder === "newscategories") {
      firestoreResponse = await firestore
        .collection(blogfolder)
        .where("newscategoryid", "==", newscategoryid)
        .get();
    } else {
      firestoreResponse = await firestore
        .collection(blogfolder)
        .orderBy(orderByField, orderByDirection)
        .get();
    }
    const fetchedData = firestoreResponse.docs.map((doc) => {
      const data = doc.data();

      return { ...data };
    });

    const payload = {
      fetchedData,
    };

    res.status(200).send(payload);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/readBlogPosts", async (req, res) => {
  const queryObject = req.query;
  const blogfolder = queryObject["blogfolder"]
    ? queryObject["blogfolder"]
    : "blogposts";
  const posturi = queryObject["posturi"] ? queryObject["posturi"] : "";
  const postcategorycode = queryObject["postcategorycode"]
    ? queryObject["postcategorycode"]
    : "";

  let orderByDirection = "desc";
  let orderByField = "";

  if (blogfolder === "blogposts") {
    orderByField = "postindex";
  } else {
    orderByField = "newsindex";
  }
  try {
    let firestoreResponse = "";
    if (posturi.length && blogfolder === "blogposts") {
      firestoreResponse = await firestore
        .collection(blogfolder)
        .where("posturi", "==", posturi)
        .get();
    } else if (posturi.length && blogfolder === "newsposts") {
      firestoreResponse = await firestore
        .collection(blogfolder)
        .where("newsid", "==", posturi)
        .get();
    } else if (postcategorycode.length && blogfolder === "blogposts") {
      firestoreResponse = await firestore
        .collection(blogfolder)
        .where("postcategorycode", "==", postcategorycode)
        .get();
    } else if (postcategorycode.length && blogfolder === "newsposts") {
      firestoreResponse = await firestore
        .collection(blogfolder)
        .where("newscategoryid", "==", postcategorycode)
        .get();
    } else {
      firestoreResponse = await firestore
        .collection(blogfolder)
        .orderBy(orderByField, orderByDirection)
        .limit(5)
        .get();
    }
    const fetchedData = firestoreResponse.docs.map((doc) => {
      const data = doc.data();

      return { ...data };
    });

    const payload = {
      fetchedData,
    };

    res.status(200).send(payload);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/", async (req, res) => {
  res.status(200).send("Hello from alphabet API");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(3005, () => {
    console.log("api started");
  });
}

module.exports = app;
