import { onRequest } from "firebase-functions/v2/https";
// Import the app - this will now trigger the initialization inside alphabetApi.js
import apiApp from "./alphabetApi.js";

/**
 * Export the Express app as a V2 HTTPS function.
 */
export const api = onRequest(
  {
    region: "us-central1",
    maxInstances: 10,
    concurrency: 80,
  },
  apiApp,
);
