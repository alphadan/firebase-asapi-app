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
  res.status(200).send(" ...done with error");
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

  let folder = "reviews";
  let reviews = "";
  reviews = require("./files/reviewsStaging.json");
  let reviewCounter = 0;
  let lastReviewId = "";

  const createNewDocBatch = async (reviews) => {
    try {
      const batch = firestore.batch();
      reviews.forEach((review) => {
        reviewCounter = reviewCounter + 1;
        let reviewString = JSON.stringify(review);
        let reviewObj = JSON.parse(reviewString);
        let docRef = firestore.collection(folder).doc();
        lastReviewId = reviewObj.reviewid;
        batch.set(docRef, reviewObj);
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
  res.status(200).send(" ...done");
  let newReviews = {};
  let reviewsdata = {};

  const getLastQueryDate = async () => {
    let firestoreResponse = await firestore.collection("reviewstats").get();

    reviewsdata = firestoreResponse.docs.map((doc) => {
      reviewsdata = doc.data();
      return { ...reviewsdata };
    });
    functions.logger.log("[getLastQueryDate ]" + reviewsdata);
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

  const insertNewReviews = async (newReviews, reviewscount) => {
    let folder = "reviews";
    const createNewDocBatch = async (newReviews, reviewscount) => {
      try {
        const batch = firestore.batch();
        for (const key in newReviews) {
          reviewscount = reviewscount + 1;
          let newDocument = {
            reviewid: reviewscount,
            reviewmerchantreviewid: key,
            reviewnickname: newReviews[key].display_name,
            revieworderid: newReviews[key].order_id,
            reviewcreatedate: newReviews[key].review_date,
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
          res.status(200).send(newDocument);
          let reviewString = JSON.stringify(newDocument);
          let reviewObj = JSON.parse(reviewString);
          let docRef = firestore.collection(folder).doc();
          batch.set(docRef, reviewObj);
        }
        batch.commit();
      } catch (error) {
        functions.logger.error(error.message);
        res.status(400).send("done with error");
      }
    };

    await createNewDocBatch(newReviews, reviewscount);
    return reviewscount;
  };

  const updateReviewsStats = async (reviewscount) => {
    let firestoreResponse = firestore.collection("reviewstats").doc();
    const setWithMerge = firestoreResponse.set(
      {
        reviewscount: reviewscount,
        lastquerydate: new Date().toISOString().split("T")[0],
      },
      { merge: true }
    );
    return 1;
  };

  const init = async () => {
    reviewsdata = await getLastQueryDate();
    let lastQueryDate = reviewsdata[0].lastquerydate;
    let reviewscount = reviewsdata[0].reviewscount;
    newReviews = await saNewReviews(lastQueryDate);
    let hasInsertNewReviews = await insertNewReviews(newReviews, reviewscount);
    let hasUpdateReviewstats = await updateReviewsStats(reviewscount);
    res.status(200).send(hasInsertNewReviews);
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

app.get("/", async (req, res) => {
  res.status(200).send("Hello from alphabet API");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(3005, () => {
    console.log("api started");
  });
}

module.exports = app;
