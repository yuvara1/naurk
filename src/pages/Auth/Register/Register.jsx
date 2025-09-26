import { React, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginGithub from "react-login-github";
import { GoogleLogin } from "@react-oauth/google";
import "../Login/Login.css";
import { authService } from "../../../services";
import { MESSAGES, STORAGE_KEYS } from "../../../utils/constants";

function Register() {
  const username = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      navigate("/");
    }
  }, [navigate]);

  async function handleRegister() {
    if (
      !username.current.value ||
      !email.current.value ||
      !password.current.value ||
      !confirmPassword.current.value
    ) {
      alert(MESSAGES.FILL_ALL_FIELDS);
      return;
    }

    if (password.current.value !== confirmPassword.current.value) {
      alert(MESSAGES.PASSWORDS_DONT_MATCH);
      return;
    }

    if (password.current.value.length < 6) {
      alert(MESSAGES.PASSWORD_TOO_SHORT);
      return;
    }

    try {
      setLoading(true);
      const result = await authService.register({
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      });

      if (result.success) {
        alert(
          `${MESSAGES.REGISTRATION_SUCCESS} Welcome ${username.current.value}!`
        );
        navigate("/");
      } else {
        alert(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="outer-layout">
        <div className="outer-logo">
          <h1>Nuark</h1>
        </div>
        <div className="login-container">
          <div className="login-inner">
            <h3 className="login-text">Creating Account...</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <div
                style={{
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #667eea",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="outer-layout">
      <div className="outer-logo">
        <h1>Nuark</h1>
      </div>
      <div className="login-container">
        <div className="login-inner">
          <h3 className="login-text">Register</h3>

          <div className="element">
            <input
              className="input-field"
              ref={username}
              type="text"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="element">
            <input
              className="input-field"
              ref={email}
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="element">
            <input
              className="input-field"
              ref={password}
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="element">
            <input
              className="input-field"
              ref={confirmPassword}
              type="password"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="element" style={{ textAlign: "center" }}>
            <Link
              to={"/login"}
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Already have an account? Sign In
            </Link>
          </div>

          <div className="element">
            <button onClick={handleRegister}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
