import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError(""); // Clear previous errors
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message); // Show error to the user
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-header">Login</h1>
      <form className="login-form" onSubmit={handleLogin}>
        {error && <p className="login-error">{error}</p>}
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
      <p className="register-link">
        Don't have an account?{" "}
        <span onClick={() => navigate("/register")} className="register-link-text">
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;
