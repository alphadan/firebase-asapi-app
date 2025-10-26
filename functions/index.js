const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("./alphabetApi");

// Initialize Firebase Admin SDK once
admin.initializeApp();

exports.api = functions.https.onRequest(app);
