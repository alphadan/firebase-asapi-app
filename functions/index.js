const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("./alphabetApi");

// admin.initializeApp(firebaseConfig);

exports.api = functions.https.onRequest(app);
