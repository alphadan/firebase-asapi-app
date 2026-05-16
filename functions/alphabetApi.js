// functions/alphabetApi.js
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = getFirestore();

const SHOPPERAPPROVED_TOKEN = defineSecret("SHOPPERAPPROVED_TOKEN");

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
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
  }),
);

app.use(express.json());

// === ENDPOINT: Fetch & Insert Reviews (Order + Product-level) ===
app.post("/fetchAndInsertReviews", async (req, res) => {
  const { from, to } = req.body;
  const token = SHOPPERAPPROVED_TOKEN.value();

  // Input Validation
  if (!from || !to) {
    logger.warn("Missing dates in request", { from, to });
    return res.status(400).json({ error: "from and to dates are required" });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(from) || !dateRegex.test(to)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD" });
  }

  try {
    logger.info(`Starting review fetch: ${from} to ${to}`);

    // -----------------------------------------------------------------
    // OPTIMIZATION: Parallel Fetching
    // Fetch both Order and Product reviews simultaneously using native fetch
    // -----------------------------------------------------------------
    const orderUrl = `https://api.shopperapproved.com/reviews/23071?token=${token}&from=${from}&to=${to}&xml=false`;
    const productUrl = `https://api.shopperapproved.com/products/reviews/23071?token=${token}&from=${from}&to=${to}&xml=false`;

    const [orderResp, productResp] = await Promise.all([
      fetch(orderUrl),
      fetch(productUrl),
    ]);

    if (!orderResp.ok || !productResp.ok) {
      logger.error("External API Failure", {
        orderStatus: orderResp.status,
        productStatus: productResp.status,
      });
      return res.status(500).json({ error: "ShopperApproved API error" });
    }

    const [orderRaw, productRaw] = await Promise.all([
      orderResp.json(),
      productResp.json(),
    ]);

    const orderEntries = Object.entries(orderRaw);
    const productEntries = Object.entries(productRaw);
    const totalEntries = orderEntries.length + productEntries.length;

    // SAFETY: Firestore batches are limited to 500 ops.
    if (totalEntries > 490) {
      return res.status(413).json({
        error:
          "Too many reviews for one batch. Please use a smaller date range.",
      });
    }

    // -----------------------------------------------------------------
    // PREPARE BATCH + STATS
    // -----------------------------------------------------------------
    const statsRef = db.collection("reviewstats").doc("XeMc8VdY9hdiBqX5kLjJ");
    const snap = await statsRef.get();
    const currentCount = snap.exists ? snap.data()?.reviewscount || 0 : 0;

    let newCount = currentCount;
    const batch = db.batch();
    let insertedCount = 0;
    const processedOrderIds = new Set();

    const processEntries = (entries, type) => {
      for (const [key, review] of entries) {
        const orderId = (review.order_id || "").toString().trim();

        // Skip order-level reviews if we already have a product-level review for this order
        if (type === "order" && orderId && processedOrderIds.has(orderId)) {
          logger.info(
            `Skipping duplicate order-level review for Order ID: ${orderId}`,
          );
          continue;
        }

        // Skip empty reviews
        if (!review.comments?.trim() && !review.heading?.trim()) continue;

        newCount++;
        insertedCount++;
        if (orderId) processedOrderIds.add(orderId);

        const newDoc = {
          reviewid: newCount.toString(),
          reviewindex: newCount,
          reviewmerchantreviewid: key.toString(),
          reviewnickname: ((name) => {
            const original = name || "Anonymous";
            const parts = original.trim().split(/\s+/);
            const first =
              parts[0].charAt(0).toUpperCase() +
              parts[0].slice(1).toLowerCase();

            let formatted = first;
            if (parts.length > 1) {
              const lastInitial = parts[parts.length - 1]
                .charAt(0)
                .toUpperCase();
              formatted = `${first} ${lastInitial}`;
              logger.info(`Formatting name: "${first}"`);
              logger.info(`Formatting name: "${lastInitial}"`);
            }

            // This will show up in your Firebase Google Cloud logs
            logger.info(`Formatting name: "${original}" -> "${formatted}"`);

            return formatted;
          })(review.display_name).substring(0, 30),
          revieworderid: orderId.substring(0, 50),
          reviewcreatedate: new Date(
            review.review_date || review.date || Date.now(),
          )
            .toISOString()
            .split("T")[0],
          reviewpageid: (
            review.product_id ||
            review.productId ||
            review.pageid ||
            ""
          )
            .toString()
            .substring(0, 50),
          reviewoverallrating: Math.min(
            Math.max(
              Number(review.rating ?? review.star ?? review.score ?? 5),
              0,
            ),
            5,
          ),
          reviewcomments: (review.comments || "").substring(0, 2000),
          reviewheadline: (review.heading || review.comments || "").substring(
            0,
            200,
          ),
          reviewstatus: "Approved",
          reviewconfirmstatus: "Verified Buyer",
          reviewresponse: null,
          reviewlanguage: "en",
          reviewlocation: (review.location || "").substring(0, 50),
          reviewtype: type,
        };

        const docRef = db.collection("reviews").doc();
        logger.info("Batch review", newDoc);
        batch.set(docRef, newDoc);
      }
    };

    processEntries(productEntries, "product");
    processEntries(orderEntries, "order");

    // Update Global Stats
    const today = new Date().toISOString().split("T")[0];
    const lastSAId = orderEntries.length
      ? orderEntries[orderEntries.length - 1][0]
      : productEntries.length
        ? productEntries[productEntries.length - 1][0]
        : "";

    batch.set(
      statsRef,
      {
        reviewscount: newCount,
        lastquerydate: to,
        lastmerchantreviewid: lastSAId,
        lastupdated: today,
      },
      { merge: true },
    );

    await batch.commit();

    logger.info("Batch commit successful", {
      inserted: insertedCount,
      total: newCount,
    });

    res.json({
      success: true,
      inserted: insertedCount,
      orderCount: orderEntries.length,
      productCount: productEntries.length,
      reviewscount: newCount,
      lastupdated: today,
    });
  } catch (error) {
    logger.error("CRASH in fetchAndInsertReviews", error);
    res.status(500).json({ error: "Internal Server Error" });
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
    let collectionRef = db.collection(folder);
    let query = collectionRef;

    if (field && value !== undefined) {
      // 1. Handle Type Conversion:
      // URL parameters are always strings. If the value is purely numeric,
      // we convert it to a Number so Firestore can find it in numeric fields.
      const queryValue = value && !isNaN(value) ? Number(value) : value;

      query = query.where(field, "==", queryValue);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    logger.info(`Read ${data.length} docs from ${folder}`, { field, value });

    res.json({
      success: true,
      folder,
      filter: field && value ? { field, value } : null,
      count: data.length,
      data,
    });
  } catch (error) {
    logger.error(`[readDocuments] ERROR in ${folder}`, error);
    res.status(500).json({ error: "Failed to read documents" });
  }
});

// === ENDPOINT: Product Summary ===
app.get("/prodSummary", async (req, res) => {
  const { productcode } = req.query;
  const token = SHOPPERAPPROVED_TOKEN.value();

  if (!productcode)
    return res.status(400).json({ error: "productcode required" });

  const saurl = `https://api.shopperapproved.com/aggregates/products/23071/${productcode}?token=${token}&xml=false`;

  try {
    const response = await fetch(saurl);
    const data = await response.json();

    if (!data.product_totals) {
      logger.error("[prodSummary]Product not found: ", saurl);
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      total_reviews: data.product_totals.total_reviews || 0,
      average_rating: parseFloat(
        data.product_totals.average_rating || 0,
      ).toFixed(1),
    });
  } catch (error) {
    logger.error("Error in prodSummary", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// === ENDPOINT: Read Review Stats ===
app.get("/readReviewStats", async (req, res) => {
  const token = SHOPPERAPPROVED_TOKEN.value();
  const saurl = `https://api.shopperapproved.com/aggregates/reviews/23071?token=${token}&xml=false`;

  try {
    const response = await fetch(saurl);
    const data = await response.json();

    res.json({
      total_reviews: parseInt(data.total_reviews, 10) || 0,
      average_rating: parseFloat(data.average_rating || 0).toFixed(1),
    });
  } catch (error) {
    logger.error("Error in readReviewStats", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// === ENDPOINT: Read Blog Categories ===
app.get("/readBlogCategories", async (req, res) => {
  const { blogfolder, bloguri, newscategoryid } = req.query;

  // Default to blogcategories if no folder provided
  const folder = blogfolder || "blogcategories";

  // Select the correct field to sort by based on the folder
  const orderByField =
    folder === "blogcategories" ? "blogcategoryname" : "newscategoryname";

  try {
    let collectionRef = db.collection(folder);
    let query;

    // 1. Logic for filtering by URI (Blogs)
    if (bloguri && folder === "blogcategories") {
      query = collectionRef.where("bloguri", "==", bloguri);
    }
    // 2. Logic for filtering by Category ID (News)
    else if (newscategoryid && folder === "newscategories") {
      query = collectionRef.where("newscategoryid", "==", newscategoryid);
    }
    // 3. Default: List all categories sorted alphabetically
    else {
      query = collectionRef.orderBy(orderByField, "asc");
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    logger.info(`Fetched ${data.length} categories from ${folder}`);

    res.json({ success: true, folder, count: data.length, data });
  } catch (error) {
    logger.error("[readBlogCategories]:ERROR", error);
    res.status(500).json({ error: "Failed to read categories" });
  }
});

// === ENDPOINT: Read Blog Posts ===
app.get("/readBlogPosts", async (req, res) => {
  const { blogfolder, posturi, postcategorycode } = req.query;

  // Default to blogposts if no folder specified
  const folder = blogfolder || "blogposts";
  const orderByField = folder === "blogposts" ? "postindex" : "newsindex";

  try {
    const collectionRef = db.collection(folder);
    let query = collectionRef;

    // 1. Filter by specific Post URI or News ID
    if (posturi) {
      const uriField = folder === "blogposts" ? "posturi" : "newsid";
      query = query.where(uriField, "==", posturi);
    }
    // 2. Filter by Category Code
    else if (postcategorycode) {
      const categoryField =
        folder === "blogposts" ? "postcategorycode" : "newscategoryid";
      query = query.where(categoryField, "==", postcategorycode);
    }
    // 3. Default: Latest 5 posts sorted by index
    else {
      query = query.orderBy(orderByField, "desc").limit(5);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    logger.info(`Read ${data.length} posts from ${folder}`, {
      posturi,
      postcategorycode,
    });

    res.json({ success: true, folder, count: data.length, data });
  } catch (error) {
    logger.error(`[readBlogPosts]:ERROR in ${folder}`, error);
    res.status(500).json({ error: "Failed to read blog posts" });
  }
});

// === ENDPOINT: Read Recent Reviews ===
app.get("/readRecentReviews", async (req, res) => {
  try {
    // 1. Fetch recent reviews sorted by ID
    const snapshot = await db
      .collection("recentreviews")
      .orderBy("reviewid", "desc")
      .get();

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // 2. Structured logging for the V2 console
    logger.info(`Fetched ${data.length} recent reviews`);

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    // 3. Log the full error stack for debugging
    logger.error("[readRecentReviews]:ERROR", error);
    res.status(500).json({ error: "Failed to read recent reviews" });
  }
});

// === ENDPOINT: Read Product Reviews (SEO Optimized) ===
app.get("/readProductReviews", async (req, res) => {
  let { prodcode } = req.query;
  if (prodcode) prodcode = decodeURIComponent(prodcode).trim();
  if (!prodcode) return res.status(400).json({ error: "prodcode required" });

  try {
    // 1. Fetch ALL reviews for this product
    // Note: We remove the .limit(24) so you have everything for JSON-LD
    const snapshot = await db
      .collection("reviews")
      .where("reviewpageid", "==", prodcode)
      .orderBy("reviewid", "desc")
      .get();

    const all_data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. Calculate Stats from the complete list
    const total_reviews = all_data.length;
    const num_good = all_data.filter(
      (r) => Number(r.reviewoverallrating) >= 4,
    ).length;
    const totalSum = all_data.reduce(
      (sum, r) => sum + Number(r.reviewoverallrating || 0),
      0,
    );
    const average_rating =
      total_reviews > 0 ? (totalSum / total_reviews).toFixed(1) : "0.0";

    // 3. Return everything in one organized package
    res.json({
      success: true,
      prodcode,
      total_reviews, // Use for Page Header
      num_good,
      average_rating, // Use for Page Header
      full_list: all_data, // Use for JSON-LD in the <head>
      // We can even provide a convenience slice for the visible UI
      display_list: all_data.slice(0, 24),
    });
  } catch (error) {
    logger.error("SEO Fetch Error", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Alphabet API v2 - Ready", status: "Healthy" });
});

export default app;
