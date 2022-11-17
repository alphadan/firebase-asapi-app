import { useState } from "react";
import FirebaseAuthService from "../FirebaseAuthService.js";
import { auth } from "../FirebaseConfig.js";

function LoginForm({ existingUser }) {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const userCredential = await FirebaseAuthService.loginUser(
        auth,
        email,
        password
      );
    } catch (error) {
      alert(error.message);
    }
  }

  function handleLogout() {
    FirebaseAuthService.logoutUser(auth);
  }

  async function handleSendResetPasswordEmail() {
    if (!email) {
      alert("Missing username");
      return;
    }

    try {
      const sendEmailResponse = await FirebaseAuthService.sendEmail(
        auth,
        email
      );
      alert("Sent the password resest email");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="login-form-container">
      <div className="row">
        <div className="title">Alphabet Signs API</div>
      </div>
      {existingUser ? (
        <div className="row">
          <h3>Welcome, {existingUser.email}</h3>
          <button
            type="button"
            className="primary-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <label className="input-label login-label">
            Username (email):
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setUsername(e.target.value)}
              className="input-text"
            />
          </label>
          <label className="input-label login-label">
            Password:
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-text"
            />
          </label>
          <div className="button-box">
            <button className="primary-button">Login</button>
            <button
              type="button"
              onClick={handleSendResetPasswordEmail}
              className="primary-button"
            >
              Reset Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
