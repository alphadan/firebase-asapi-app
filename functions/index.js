// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK **ONCE**
admin.initializeApp();

const api = require("./alphabetApi");

// Export the Express app as a single HTTPS function
exports.api = functions.https.onRequest(api);
