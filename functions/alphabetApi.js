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

// === ROOT ===
app.get("/", (req, res) => {
  res.json({ message: "Alphabet API v2 - Ready" });
});

module.exports = app;
