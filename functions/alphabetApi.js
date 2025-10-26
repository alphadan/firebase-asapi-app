const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS with specific origins
app.use(
  cors({
    origin: ["http://localhost:3000", "https://fir-asapi.web.app"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Explicitly handle OPTIONS requests
app.options("*", (req, res) => {
  const origin = req.get("Origin") || "*";
  if (["http://localhost:3000", "https://fir-asapi.web.app"].includes(origin)) {
    res.set({
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "3600",
    });
    res.status(204).send("");
  } else {
    res.status(403).send("Forbidden: Invalid origin");
  }
});

// Middleware to ensure CORS headers for all responses
app.use((req, res, next) => {
  const origin = req.get("Origin") || "*";
  if (["http://localhost:3000", "https://fir-asapi.web.app"].includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  } else {
    res.set("Access-Control-Allow-Origin", "*"); // Fallback for safety
  }
  next();
});

// Parse JSON bodies
app.use(express.json());

// Endpoint: readDocuments (POST)
app.post("/readDocuments", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
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
    functions.logger.error("[readDocuments]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Endpoint: readDocuments (GET)
app.get("/readDocuments", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
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
    functions.logger.error("[readDocuments]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Endpoint: readProductReviews
app.get("/readProductReviews", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
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
    functions.logger.error("[readProductReviews]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Endpoint: readRecentReviews
app.get("/readRecentReviews", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
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
    functions.logger.error("[readRecentReviews]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Endpoint: setReviews
app.post("/setReviews", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
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
  try {
    reviews = require("./files/reviewsStaging.json");
  } catch (error) {
    functions.logger.error(
      "[setReviews]:error loading reviewsStaging.json",
      error.message,
      error
    );
    return res.status(400).send("Failed to load reviewsStaging.json");
  }

  const createNewDocBatch = async (reviews) => {
    try {
      const batch = firestore.batch();
      reviews.forEach((review) => {
        let docRef = firestore.collection(folder).doc();
        let b = Buffer.from(review.postcontent || "", "base64");
        review.postcontent = b.toString();
        batch.set(docRef, review);
      });
      await batch.commit();
    } catch (error) {
      functions.logger.error("[setReviews]:error", error.message, error);
      res.status(400).send("done with error");
    }
  };

  await createNewDocBatch(reviews);
  res.status(200).send("done");
});

// Endpoint: updateReviews
app.post("/updateReviews", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
  let newReviews = {};
  let reviewsdata = {};
  let reviewscount = 0;
  let reviewstats = {};

  const getLastQueryDate = async () => {
    try {
      const querySnapshot = await firestore
        .collection("reviewstats")
        .doc("XeMc8VdY9hdiBqX5kLjJ")
        .get();
      return querySnapshot.data();
    } catch (error) {
      functions.logger.error("[getLastQueryDate]:error", error.message, error);
      throw error;
    }
  };

  const saNewReviews = async (lastQueryDate) => {
    let saurl = `https://api.shopperapproved.com/products/reviews/23071?token=${
      functions.config().shopperapproved.token
    }&from=${lastQueryDate}&xml=false`;
    const response = await fetch(saurl);
    if (!response.ok) {
      throw new Error(`ShopperApproved API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  };

  const insertNewReviews = async (
    newReviews,
    reviewscount,
    lastMerchantReviewId
  ) => {
    let folder = "reviews";
    let currentMerchantReviewId = Number(lastMerchantReviewId);
    const createNewDocBatch = async (
      newReviews,
      reviewscount,
      lastMerchantReviewId
    ) => {
      try {
        const batch = firestore.batch();
        for (const key in newReviews) {
          if (Number(key) > Number(lastMerchantReviewId)) {
            reviewscount = reviewscount + 1;
            let year = new Date(newReviews[key].review_date).getFullYear();
            let month = new Date(newReviews[key].review_date).getMonth() + 1;
            let date = new Date(newReviews[key].review_date).getDate();
            let review_date_string = `${year}-${month}-${date}`;
            let newDocument = {
              reviewid: reviewscount.toString(),
              reviewindex: Number(reviewscount),
              reviewmerchantreviewid: key.toString(),
              reviewnickname: newReviews[key].display_name || "",
              revieworderid: newReviews[key].order_id || "",
              reviewcreatedate: review_date_string,
              reviewpageid: newReviews[key].product_id || "",
              reviewoverallrating: Number(newReviews[key].rating) || 0,
              reviewcomments: newReviews[key].comments || "",
              reviewheadline: newReviews[key].heading || "",
              reviewstatus: "Approved",
              reviewconfirmstatus: "Verified Buyer",
              reviewresponse: null,
              reviewlanguage: "en",
              reviewlocation: newReviews[key].location || "",
            };
            let docRef = firestore.collection(folder).doc();
            batch.set(docRef, newDocument);
            currentMerchantReviewId = Math.max(
              Number(key),
              currentMerchantReviewId
            );
          }
        }
        await batch.commit();
        return { reviewscount, currentMerchantReviewId };
      } catch (error) {
        functions.logger.error(
          "[insertNewReviews]:error",
          error.message,
          error
        );
        res.status(400).send("done with error");
      }
    };

    return await createNewDocBatch(
      newReviews,
      reviewscount,
      lastMerchantReviewId
    );
  };

  const updateReviewsStats = async (reviewscount, lastMerchantReviewId) => {
    const year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    const date = new Date().getDate();
    const lastquerydate = `${year}-${month}-${date}`;
    await firestore.collection("reviewstats").doc("XeMc8VdY9hdiBqX5kLjJ").set(
      {
        reviewscount: reviewscount,
        lastquerydate: lastquerydate.toString(),
        lastmerchantreviewid: lastMerchantReviewId.toString(),
      },
      { merge: true }
    );
    return 1;
  };

  try {
    reviewsdata = await getLastQueryDate();
    let lastQueryDate = reviewsdata.lastquerydate;
    reviewscount = reviewsdata.reviewscount || 0;
    let lastMerchantReviewId = reviewsdata.lastmerchantreviewid || 0;
    newReviews = await saNewReviews(lastQueryDate);
    reviewstats = await insertNewReviews(
      newReviews,
      reviewscount,
      lastMerchantReviewId
    );
    functions.logger.log("[init]:reviewcount " + reviewstats.reviewscount);
    functions.logger.log(
      "[init]:lastMerchantReviewId " + reviewstats.currentMerchantReviewId
    );
    await updateReviewsStats(
      reviewstats.reviewscount,
      reviewstats.currentMerchantReviewId
    );
    res.status(200).send("done " + reviewstats.reviewscount);
  } catch (error) {
    functions.logger.error("[updateReviews]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Endpoint: fetchReviewsByDateRange
app.post("/fetchReviewsByDateRange", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
  const { startDate, endDate } = req.body;

  // Validate input
  if (!startDate || !endDate) {
    return res.status(400).send("startDate and endDate are required");
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return res.status(400).send("Invalid date format. Use YYYY-MM-DD");
  }

  try {
    // Fetch reviews from ShopperApproved
    const saUrl = `https://api.shopperapproved.com/products/reviews/23071?token=${
      functions.config().shopperapproved.token
    }&from=${startDate}&to=${endDate}&xml=false`;
    const response = await fetch(saUrl);
    if (!response.ok) {
      throw new Error(`ShopperApproved API error: ${response.statusText}`);
    }
    const newReviews = await response.json();

    // Get current review stats
    const reviewStatsRef = firestore
      .collection("reviewstats")
      .doc("XeMc8VdY9hdiBqX5kLjJ");
    const reviewStatsSnap = await reviewStatsRef.get();
    let reviewscount = reviewStatsSnap.exists
      ? reviewStatsSnap.data().reviewscount || 0
      : 0;
    let lastMerchantReviewId = reviewStatsSnap.exists
      ? reviewStatsSnap.data().lastmerchantreviewid || 0
      : 0;

    // Insert new reviews
    const batch = firestore.batch();
    for (const key in newReviews) {
      if (Number(key) > Number(lastMerchantReviewId)) {
        reviewscount += 1;
        const review = newReviews[key];
        const year = new Date(review.review_date).getFullYear();
        const month = new Date(review.review_date).getMonth() + 1;
        const date = new Date(review.review_date).getDate();
        const review_date_string = `${year}-${month}-${date}`;
        const newDocument = {
          reviewid: reviewscount.toString(),
          reviewindex: Number(reviewscount),
          reviewmerchantreviewid: key.toString(),
          reviewnickname: review.display_name || "",
          revieworderid: review.order_id || "",
          reviewcreatedate: review_date_string,
          reviewpageid: review.product_id || "",
          reviewoverallrating: Number(review.rating) || 0,
          reviewcomments: review.comments || "",
          reviewheadline: review.heading || "",
          reviewstatus: "Approved",
          reviewconfirmstatus: "Verified Buyer",
          reviewresponse: null,
          reviewlanguage: "en",
          reviewlocation: review.location || "",
        };
        const docRef = firestore.collection("reviews").doc();
        batch.set(docRef, newDocument);
        lastMerchantReviewId = Math.max(
          Number(key),
          Number(lastMerchantReviewId)
        );
      }
    }

    // Update reviewstats
    const today = new Date();
    const lastquerydate = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    batch.set(
      reviewStatsRef,
      {
        reviewscount,
        lastquerydate,
        lastmerchantreviewid: lastMerchantReviewId.toString(),
      },
      { merge: true }
    );

    await batch.commit();
    res.status(200).send({ reviewscount, lastMerchantReviewId, lastquerydate });
  } catch (error) {
    functions.logger.error(
      "[fetchReviewsByDateRange]:error",
      error.message,
      error
    );
    res.status(400).send(error.message);
  }
});

// Endpoint: updateRecentReviews
app.post("/updateRecentReviews", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
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
      functions.logger.log(
        "[getRecentReviews]:success",
        firestoreResponse.size
      );
      return firestoreResponse.docs.map((doc) => doc.data());
    } catch (error) {
      functions.logger.error("[getRecentReviews]:error", error.message, error);
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
        await batch.commit();
      } catch (error) {
        functions.logger.error(
          "[insertNewRecentReviews]:error",
          error.message,
          error
        );
        res.status(400).send("done with error");
      }
    };
    await createNewDocBatch(recentreviews);
    return;
  };

  try {
    let recentreviews = await getRecentReviews();
    await deleteRecentReviewsCollection();
    await insertNewRecentReviews(recentreviews);
    res.status(200).send(recentreviews);
  } catch (error) {
    functions.logger.error("[updateRecentReviews]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Endpoint: prodSummary
app.get("/prodSummary", async (req, res) => {
  const queryObject = req.query;
  const productcode = queryObject["productcode"];
  let saurl = `https://api.shopperapproved.com/aggregates/products/23071/${productcode}?token=${
    functions.config().shopperapproved.token
  }&xml=false`;
  try {
    const response = await fetch(saurl);
    if (!response.ok) {
      throw new Error(`ShopperApproved API error: ${response.statusText}`);
    }
    const data = await response.json();
    const prodSummary = {
      total_reviews: data.product_totals.total_reviews,
      average_rating: data.product_totals.average_rating,
    };
    res.status(200).send(prodSummary);
  } catch (error) {
    functions.logger.error("[prodSummary]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Endpoint: readReviewStats
app.get("/readReviewStats", async (req, res) => {
  let saurl = `https://api.shopperapproved.com/aggregates/reviews/23071?token=${
    functions.config().shopperapproved.token
  }&xml=false`;
  try {
    const response = await fetch(saurl);
    if (!response.ok) {
      throw new Error(`ShopperApproved API error: ${response.statusText}`);
    }
    const data = await response.json();
    const reviewStats = {
      total_reviews: data.total_reviews,
      average_rating: data.average_rating,
    };
    res.status(200).send(reviewStats);
  } catch (error) {
    functions.logger.error("[readReviewStats]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Endpoint: updateReviewFields
app.get("/updateReviewFields", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
  const folder = "reviews";

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
    functions.logger.error("[updateReviewFields]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Endpoint: readBlogCategories
app.get("/readBlogCategories", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
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
    functions.logger.error("[readBlogCategories]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Endpoint: readBlogPosts
app.get("/readBlogPosts", async (req, res) => {
  const firestore = admin.firestore(); // Initialize Firestore here
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
    functions.logger.error("[readBlogPosts]:error", error.message, error);
    res.status(400).send(error.message);
  }
});

// Root endpoint
app.get("/", async (req, res) => {
  res.status(200).send("Hello from alphabet API");
});

// Export the Express app
module.exports = app;
