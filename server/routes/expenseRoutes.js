const express = require("express");
const admin = require("../firebaseConfig");

const router = express.Router();

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expensesSnapshot = await admin.firestore().collection("expenses").get();
    const expenses = expensesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
});

// Add a new expense
router.post("/", async (req, res) => {
  const { amount, category, description } = req.body;
  try {
    const newExpense = { amount, category, description, createdAt: new Date().toISOString() };
    const docRef = await admin.firestore().collection("expenses").add(newExpense);
    res.status(201).json({ message: "Expense added", id: docRef.id });
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error });
  }
});

// Delete an expense
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await admin.firestore().collection("expenses").doc(id).delete();
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
});

module.exports = router;
