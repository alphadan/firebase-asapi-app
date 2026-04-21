import { onRequest } from "firebase-functions/v2/https";
import apiApp from "./alphabetApi.js";
import { defineSecret } from "firebase-functions/params";

const RECAPTCHA_SECRET = defineSecret("RECAPTCHA_SECRET");

export const reCaptchResponse = onRequest(
  {
    region: "us-central1",
    secrets: [RECAPTCHA_SECRET], // Link the secret to the function
    cors: ["https://www.alphabetsigns.com", "https://alphabetsigns.com"], // Built-in CORS!
  },
  async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Missing token" });

    try {
      const secret = RECAPTCHA_SECRET.value();
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
      const response = await fetch(verifyUrl, { method: "POST" });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ success: false });
    }
  },
);

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
