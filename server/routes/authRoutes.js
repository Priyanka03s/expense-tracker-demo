const express = require("express");
const admin = require("../firebaseConfig");

const router = express.Router();

// Verify user token
router.post("/verify", async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.status(200).json({ message: "Token verified", user: decodedToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
});

module.exports = router;
