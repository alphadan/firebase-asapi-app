// functions/alphabetApi.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

// Load .env only in local emulator
if (process.env.FUNCTIONS_EMULATOR) {
  require("dotenv").config();
}

const token = process.env.FUNCTIONS_EMULATOR
  ? process.env.SHOPPERAPPROVED_TOKEN
  : functions.config().shopperapproved.token;

if (!token) {
  functions.logger.error("Missing ShopperApproved token");
  return res
    .status(500)
    .json({ error: "Server misconfigured: missing API token" });
}

// DO NOT CALL admin.initializeApp() — index.js already did it
const db = admin.firestore(); // This now works

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://fir-asapi.web.app",
  "https://www.alphabetsigns.com", // Add your domain
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// === ENDPOINT: Fetch & Insert New Reviews ===
app.post("/fetchAndInsertReviews", async (req, res) => {
  functions.logger.info("fetchAndInsertReviews REQUEST", {
    url: req.url,
    body: req.body,
  });

  const { from, to } = req.body;

  if (!from || !to) {
    functions.logger.warn("Missing dates", { from, to });
    return res.status(400).json({ error: "from and to required" });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(from) || !dateRegex.test(to)) {
    functions.logger.warn("Invalid date format", { from, to });
    return res.status(400).json({ error: "Use YYYY-MM-DD" });
  }

  functions.logger.info("Date range", { from, to });

  try {
    // === TOKEN ===
    const token = process.env.FUNCTIONS_EMULATOR
      ? process.env.SHOPPERAPPROVED_TOKEN
      : functions.config().shopperapproved.token;

    if (!token) {
      functions.logger.error("Missing token");
      return res.status(500).json({ error: "Missing API token" });
    }

    // === FETCH FROM SA ===
    const saUrl = `https://api.shopperapproved.com/reviews/23071?token=${token}&from=${from}&to=${to}&xml=false`;
    functions.logger.info("SA API", { saUrl });

    const response = await fetch(saUrl);
    if (!response.ok) {
      const text = await response.text();
      functions.logger.error("SA failed", {
        status: response.status,
        body: text.substring(0, 500),
      });
      return res.status(500).json({ error: "SA API error" });
    }

    const rawReviews = await response.json();
    const entries = Object.entries(rawReviews);
    functions.logger.info("SA reviews", { count: entries.length });

    if (entries.length === 0) {
      return res.json({ inserted: 0 });
    }

    // === GET CURRENT STATS ===
    const statsRef = db.collection("reviewstats").doc("XeMc8VdY9hdiBqX5kLjJ");
    const snap = await statsRef.get();
    const currentCount = snap.exists ? snap.data()?.reviewscount || 0 : 0;
    let newCount = currentCount;

    const batch = db.batch();
    let inserted = 0;

    // === FILTER & INSERT ONLY VALID REVIEWS ===
    for (const [key, review] of entries) {
      const hasComments = review.comments && review.comments.trim().length > 0;
      const hasHeadline = review.heading && review.heading.trim().length > 0;

      // SKIP if BOTH are missing
      if (!hasComments && !hasHeadline) {
        functions.logger.debug("SKIPPED review (no comments or headline)", {
          merchantId: key,
          headline: review.heading,
          comments: review.comments,
        });
        continue;
      }

      newCount++;
      inserted++;

      const reviewDate =
        review.review_date && /^\d{4}-\d{1,2}-\d{1,2}$/.test(review.review_date)
          ? review.review_date
          : "2025-01-01";

      const newDoc = {
        reviewid: newCount.toString(),
        reviewindex: newCount,
        reviewmerchantreviewid: key.toString(),
        reviewnickname: (review.display_name || "Anonymous").substring(0, 30),
        revieworderid: (review.order_id || "").substring(0, 50),
        reviewcreatedate: reviewDate,
        reviewpageid: (review.product_id || "").substring(0, 50),
        reviewoverallrating: Math.min(
          Math.max(Number(review.rating) || 0, 0),
          5
        ),
        reviewcomments: (review.comments || "").substring(0, 2000),
        reviewheadline: (review.heading || "").substring(0, 200),
        reviewstatus: "Approved",
        reviewconfirmstatus: "Verified Buyer",
        reviewresponse: null,
        reviewlanguage: "en",
        reviewlocation: (review.location || "").substring(0, 50),
      };

      const docRef = db.collection("reviews").doc();
      batch.set(docRef, newDoc);

      functions.logger.debug("INSERTING review", {
        reviewid: newCount,
        merchantId: key,
        hasComments,
        hasHeadline,
      });
    }

    // === UPDATE STATS ===
    const today = new Date().toISOString().split("T")[0];

    batch.set(
      statsRef,
      {
        reviewscount: newCount,
        lastquerydate: to,
        lastmerchantreviewid: entries[entries.length - 1][0],
        lastupdated: today,
      },
      { merge: true }
    );

    functions.logger.info("Committing batch", { inserted, newCount });

    await batch.commit();

    functions.logger.info("SUCCESS", {
      inserted,
      reviewscount: newCount,
      lastquerydate: to,
      lastupdated: today,
    });

    res.json({
      inserted,
      reviewscount: newCount,
      lastquerydate: to,
      lastupdated: today,
    });
  } catch (error) {
    functions.logger.error("CRASH", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Server error" });
  }
});

// === NEW ENDPOINT: Read Documents (Public JSON API) ===
app.get("/readDocuments", async (req, res) => {
  const { folder, field, value } = req.query;

  if (!folder) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: folder" });
  }

  try {
    let collectionRef = db.collection(folder);
    let query = collectionRef;

    if (field && value !== undefined) {
      query = collectionRef.where(field, "==", value);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      folder,
      filter: field && value ? { field, value } : null,
      count: data.length,
      data,
    });
  } catch (error) {
    functions.logger.error("[readDocuments] ERROR", { error: error.message });
    res.status(500).json({ error: "Failed to read documents" });
  }
});

// === NEW ENDPOINT: Product Summary (ShopperApproved) ===
app.get("/prodSummary", async (req, res) => {
  const { productcode } = req.query;

  if (!productcode) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: productcode" });
  }

  const token = process.env.FUNCTIONS_EMULATOR
    ? process.env.SHOPPERAPPROVED_TOKEN
    : functions.config().shopperapproved.token;

  if (!token) {
    functions.logger.error("Missing ShopperApproved token");
    return res.status(500).json({ error: "API token not configured" });
  }

  const saurl = `https://api.shopperapproved.com/aggregates/products/23071/${productcode}?token=${token}&xml=false`;

  try {
    const response = await fetch(saurl);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `ShopperApproved API error: ${response.status} ${
          response.statusText
        } - ${text.substring(0, 200)}`
      );
    }

    const data = await response.json();

    if (!data.product_totals) {
      return res.status(404).json({ error: "No data found for this product" });
    }

    const prodSummary = {
      total_reviews: data.product_totals.total_reviews || 0,
      average_rating: parseFloat(
        data.product_totals.average_rating || 0
      ).toFixed(1),
    };

    res.status(200).json(prodSummary);
  } catch (error) {
    functions.logger.error("[prodSummary]:ERROR", {
      productcode,
      message: error.message,
    });
    res.status(500).json({ error: "Failed to fetch product summary" });
  }
});

// === NEW ENDPOINT: Read Review Stats (ShopperApproved) ===
app.get("/readReviewStats", async (req, res) => {
  const token = process.env.FUNCTIONS_EMULATOR
    ? process.env.SHOPPERAPPROVED_TOKEN
    : functions.config().shopperapproved.token;

  if (!token) {
    functions.logger.error("Missing ShopperApproved token");
    return res.status(500).json({ error: "API token not configured" });
  }

  const saurl = `https://api.shopperapproved.com/aggregates/reviews/23071?token=${token}&xml=false`;

  try {
    const response = await fetch(saurl);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `ShopperApproved API error: ${response.status} ${
          response.statusText
        } - ${text.substring(0, 200)}`
      );
    }

    const data = await response.json();

    // Validate expected structure
    if (!data || typeof data.total_reviews === "undefined") {
      return res
        .status(404)
        .json({ error: "No review stats returned from API" });
    }

    const reviewStats = {
      total_reviews: parseInt(data.total_reviews, 10) || 0,
      average_rating: parseFloat(data.average_rating || 0).toFixed(1),
    };

    res.status(200).json(reviewStats);
  } catch (error) {
    functions.logger.error("[readReviewStats]:ERROR", {
      message: error.message,
      url: saurl,
    });
    res.status(500).json({ error: "Failed to fetch review stats" });
  }
});

// === ENDPOINT: Read Blog Categories (or News Categories) ===
app.get("/readBlogCategories", async (req, res) => {
  const { blogfolder, bloguri, newscategoryid } = req.query;

  const folder = blogfolder || "blogcategories";
  const orderByField =
    folder === "blogcategories" ? "blogcategoryname" : "newscategoryname";
  const orderByDirection = "asc";

  try {
    let snapshot;

    if (bloguri && folder === "blogcategories") {
      snapshot = await db
        .collection(folder)
        .where("bloguri", "==", bloguri)
        .get();
    } else if (newscategoryid && folder === "newscategories") {
      snapshot = await db
        .collection(folder)
        .where("newscategoryid", "==", newscategoryid)
        .get();
    } else {
      snapshot = await db
        .collection(folder)
        .orderBy(orderByField, orderByDirection)
        .get();
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      folder,
      count: data.length,
      data,
    });
  } catch (error) {
    functions.logger.error("[readBlogCategories]:ERROR", {
      folder,
      bloguri,
      newscategoryid,
      message: error.message,
    });
    res.status(500).json({ error: "Failed to read blog categories" });
  }
});

// === ENDPOINT: Read Blog Posts (or News Posts) ===
app.get("/readBlogPosts", async (req, res) => {
  const { blogfolder, posturi, postcategorycode } = req.query;

  const folder = blogfolder || "blogposts";
  const orderByField = folder === "blogposts" ? "postindex" : "newsindex";
  const orderByDirection = "desc";

  try {
    let snapshot;

    if (posturi && folder === "blogposts") {
      snapshot = await db
        .collection(folder)
        .where("posturi", "==", posturi)
        .get();
    } else if (posturi && folder === "newsposts") {
      snapshot = await db
        .collection(folder)
        .where("newsid", "==", posturi)
        .get();
    } else if (postcategorycode && folder === "blogposts") {
      snapshot = await db
        .collection(folder)
        .where("postcategorycode", "==", postcategorycode)
        .get();
    } else if (postcategorycode && folder === "newsposts") {
      snapshot = await db
        .collection(folder)
        .where("newscategoryid", "==", postcategorycode)
        .get();
    } else {
      snapshot = await db
        .collection(folder)
        .orderBy(orderByField, orderByDirection)
        .limit(5)
        .get();
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      folder,
      count: data.length,
      data,
    });
  } catch (error) {
    functions.logger.error("[readBlogPosts]:ERROR", {
      folder,
      posturi,
      postcategorycode,
      message: error.message,
    });
    res.status(500).json({ error: "Failed to read blog posts" });
  }
});

// === ENDPOINT: Read Recent Reviews (Public JSON) ===
app.get("/readRecentReviews", async (req, res) => {
  const folder = "recentreviews";
  const orderByField = "reviewid";
  const orderByDirection = "desc";

  try {
    const snapshot = await db
      .collection(folder)
      .orderBy(orderByField, orderByDirection)
      .get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      folder,
      count: data.length,
      data,
    });
  } catch (error) {
    functions.logger.error("[readRecentReviews]:ERROR", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Failed to read recent reviews" });
  }
});

// === ROOT ===
app.get("/", (req, res) => {
  res.json({ message: "Alphabet API v2 - Ready" });
});

module.exports = app;
