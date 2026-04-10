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

// DO NOT CALL admin.initializeApp() — index.js already did it
const db = admin.firestore();

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://fir-asapi.web.app",
  "https://www.alphabetsigns.com",
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

// === HELPER: Get Token Safely ===
const getShopperApprovedToken = () => {
  return process.env.FUNCTIONS_EMULATOR
    ? process.env.SHOPPERAPPROVED_TOKEN
    : functions.config().shopperapproved?.token;
};

// === ENDPOINT: Fetch & Insert Reviews (Order + Product-level) ===
app.post("/fetchAndInsertReviews", async (req, res) => {
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

  try {
    const token = getShopperApprovedToken();
    if (!token) {
      functions.logger.error("Missing ShopperApproved token");
      return res.status(500).json({ error: "API token not configured" });
    }

    // -----------------------------------------------------------------
    // 1. ORDER-LEVEL REVIEWS (your original endpoint)
    // -----------------------------------------------------------------
    const orderUrl = `https://api.shopperapproved.com/reviews/23071?token=${token}&from=${from}&to=${to}&xml=false`;
    const orderResp = await fetch(orderUrl);
    if (!orderResp.ok) {
      const txt = await orderResp.text();
      functions.logger.error("Order-level SA failed", {
        status: orderResp.status,
        body: txt.substring(0, 500),
      });
      return res.status(500).json({ error: "Order-level SA API error" });
    }
    const orderRaw = await orderResp.json();
    const orderEntries = Object.entries(orderRaw);

    // -----------------------------------------------------------------
    // 2. PRODUCT-LEVEL REVIEWS (new endpoint)
    // -----------------------------------------------------------------
    const productUrl = `https://api.shopperapproved.com/products/reviews/23071?token=${token}&from=${from}&to=${to}&xml=false`;
    const productResp = await fetch(productUrl);
    if (!productResp.ok) {
      const txt = await productResp.text();
      functions.logger.error("Product-level SA failed", {
        status: productResp.status,
        body: txt.substring(0, 500),
      });
      return res.status(500).json({ error: "Product-level SA API error" });
    }
    const productRaw = await productResp.json();
    const productEntries = Object.entries(productRaw);

    // -----------------------------------------------------------------
    // 3. PREPARE BATCH + STATS
    // -----------------------------------------------------------------
    const statsRef = db.collection("reviewstats").doc("XeMc8VdY9hdiBqX5kLjJ");
    const snap = await statsRef.get();
    const currentCount = snap.exists ? snap.data()?.reviewscount || 0 : 0;
    let newCount = currentCount;

    const batch = db.batch();
    let inserted = 0;

    const processEntries = (entries, type) => {
      for (const [key, review] of entries) {
        const hasComments =
          review.comments && review.comments.trim().length > 0;
        const hasHeadline = review.heading && review.heading.trim().length > 0;

        if (!hasComments && !hasHeadline) {
          functions.logger.debug(
            `SKIPPED ${type} review (no headline/comment)`,
            { key }
          );
          continue;
        }

        newCount++;
        inserted++;

        const reviewDate =
          review.review_date &&
          /^\d{4}-\d{1,2}-\d{1,2}$/.test(review.review_date)
            ? review.review_date
            : "2026-01-01";

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

          // NEW FIELD – tells us the source
          reviewtype: type, // "order" or "product"
        };

        const docRef = db.collection("reviews").doc();
        batch.set(docRef, newDoc);
      }
    };

    // Process both sets
    processEntries(orderEntries, "order");
    processEntries(productEntries, "product");

    // -----------------------------------------------------------------
    // 4. UPDATE STATS (once per request)
    // -----------------------------------------------------------------
    const today = new Date().toISOString().split("T")[0];
    batch.set(
      statsRef,
      {
        reviewscount: newCount,
        lastquerydate: to,
        lastmerchantreviewid: orderEntries.length
          ? orderEntries[orderEntries.length - 1][0]
          : productEntries[productEntries.length - 1]?.[0] || "",
        lastupdated: today,
      },
      { merge: true }
    );

    await batch.commit();

    functions.logger.info("SUCCESS - both sources", {
      inserted,
      orderCount: orderEntries.length,
      productCount: productEntries.length,
      totalInserted: inserted,
      reviewscount: newCount,
    });

    res.json({
      inserted,
      orderCount: orderEntries.length,
      productCount: productEntries.length,
      reviewscount: newCount,
      lastquerydate: to,
      lastupdated: today,
    });
  } catch (error) {
    functions.logger.error("CRASH in fetchAndInsertReviews", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Server error" });
  }
});

// === ENDPOINT: Read Documents (Public JSON API) ===
app.get("/readDocuments", async (req, res) => {
  const { folder, field, value } = req.query;

  if (!folder) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: folder" });
  }

  try {
    let query = db.collection(folder);
    if (field && value !== undefined) {
      query = query.where(field, "==", value);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

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

// === ENDPOINT: Product Summary ===
app.get("/prodSummary", async (req, res) => {
  const { productcode } = req.query;
  if (!productcode) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: productcode" });
  }

  const token = getShopperApprovedToken();
  if (!token) {
    functions.logger.error("Missing ShopperApproved token in prodSummary");
    return res.status(500).json({ error: "API token not configured" });
  }

  const saurl = `https://api.shopperapproved.com/aggregates/products/23071/${productcode}?token=${token}&xml=false`;

  try {
    const response = await fetch(saurl);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `ShopperApproved API error: ${response.status} - ${text.substring(
          0,
          200
        )}`
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

    res.json(prodSummary);
  } catch (error) {
    functions.logger.error("[prodSummary]:ERROR", {
      productcode,
      message: error.message,
    });
    res.status(500).json({ error: "Failed to fetch product summary" });
  }
});

// === ENDPOINT: Read Review Stats ===
app.get("/readReviewStats", async (req, res) => {
  const token = getShopperApprovedToken();
  if (!token) {
    functions.logger.error("Missing ShopperApproved token in readReviewStats");
    return res.status(500).json({ error: "API token not configured" });
  }

  const saurl = `https://api.shopperapproved.com/aggregates/reviews/23071?token=${token}&xml=false`;

  try {
    const response = await fetch(saurl);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `ShopperApproved API error: ${response.status} - ${text.substring(
          0,
          200
        )}`
      );
    }

    const data = await response.json();
    if (typeof data.total_reviews === "undefined") {
      return res
        .status(404)
        .json({ error: "No review stats returned from API" });
    }

    const reviewStats = {
      total_reviews: parseInt(data.total_reviews, 10) || 0,
      average_rating: parseFloat(data.average_rating || 0).toFixed(1),
    };

    res.json(reviewStats);
  } catch (error) {
    functions.logger.error("[readReviewStats]:ERROR", {
      message: error.message,
    });
    res.status(500).json({ error: "Failed to fetch review stats" });
  }
});

// === ENDPOINT: Read Blog Categories ===
app.get("/readBlogCategories", async (req, res) => {
  const { blogfolder, bloguri, newscategoryid } = req.query;
  const folder = blogfolder || "blogcategories";
  const orderByField =
    folder === "blogcategories" ? "blogcategoryname" : "newscategoryname";

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
      snapshot = await db.collection(folder).orderBy(orderByField, "asc").get();
    }

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, folder, count: data.length, data });
  } catch (error) {
    functions.logger.error("[readBlogCategories]:ERROR", {
      message: error.message,
    });
    res.status(500).json({ error: "Failed to read blog categories" });
  }
});

// === ENDPOINT: Read Blog Posts ===
app.get("/readBlogPosts", async (req, res) => {
  const { blogfolder, posturi, postcategorycode } = req.query;
  const folder = blogfolder || "blogposts";
  const orderByField = folder === "blogposts" ? "postindex" : "newsindex";

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
        .orderBy(orderByField, "desc")
        .limit(5)
        .get();
    }

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, folder, count: data.length, data });
  } catch (error) {
    functions.logger.error("[readBlogPosts]:ERROR", { message: error.message });
    res.status(500).json({ error: "Failed to read blog posts" });
  }
});

// === ENDPOINT: Read Recent Reviews ===
app.get("/readRecentReviews", async (req, res) => {
  try {
    const snapshot = await db
      .collection("recentreviews")
      .orderBy("reviewid", "desc")
      .get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    functions.logger.error("[readRecentReviews]:ERROR", {
      message: error.message,
    });
    res.status(500).json({ error: "Failed to read recent reviews" });
  }
});

// === ENDPOINT: Read Product Reviews ===
app.get("/readProductReviews", async (req, res) => {
  const { prodcode, limit: limitStr } = req.query;
  if (!prodcode) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: prodcode" });
  }

  const limit = Math.min(parseInt(limitStr, 10) || 24, 100);

  try {
    const snapshot = await db
      .collection("reviews")
      .where("reviewpageid", "==", prodcode)
      .orderBy("reviewid", "desc")
      .limit(limit)
      .get();

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, prodcode, limit, count: data.length, data });
  } catch (error) {
    functions.logger.error("[readProductReviews]:ERROR", {
      prodcode,
      message: error.message,
    });
    res.status(500).json({ error: "Failed to read product reviews" });
  }
});

// === ROOT ===
app.get("/", (req, res) => {
  res.json({ message: "Alphabet API v2 - Ready" });
});

module.exports = app;
