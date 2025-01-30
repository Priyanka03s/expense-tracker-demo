import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig"; // Ensure auth is imported
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Dashboard.css"; // Import the CSS file

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Income");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);

  // Fetch the logged-in user's details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch expenses for the logged-in user
  const fetchExpenses = () => {
    if (user) {
      const expensesQuery = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid) // Filter by logged-in user's UID
      );
      const unsub = onSnapshot(expensesQuery, (snapshot) => {
        setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return unsub;
    }
  };

  // Add a new expense
  const addExpense = async (e) => {
    e.preventDefault();
    if (user) {
      await addDoc(collection(db, "expenses"), {
        userId: user.uid, // Associate expense with logged-in user's UID
        amount,
        category,
        description,
      });
      setAmount("");
      setDescription("");
    }
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
  };

  // Export expenses to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 20, 10);
    doc.autoTable({
      head: [["Amount", "Category", "Description"]],
      body: expenses.map((expense) => [
        expense.amount,
        expense.category,
        expense.description,
      ]),
    });
    doc.save("expense-report.pdf");
  };

  // Fetch expenses when the user is available
  useEffect(() => {
    const unsub = fetchExpenses();
    return () => unsub && unsub();
  }, [user]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Expense Tracker</h1>
      <form className="dashboard-form" onSubmit={addExpense}>
        <input
          className="dashboard-input"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className="dashboard-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <input
          className="dashboard-input"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="dashboard-button" type="submit">
          Add Expense
        </button>
      </form>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{expense.description}</td>
              <td className="dashboard-actions">
                <button onClick={() => deleteExpense(expense.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="dashboard-export" onClick={exportToPDF}>
        Export to PDF
      </button>
    </div>
  );
}

export default Dashboard;
