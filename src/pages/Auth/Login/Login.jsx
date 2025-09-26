import React from "react";
import { useEffect, useState, useRef } from "react";
import LoginGithub from "react-login-github";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../../services";
import { MESSAGES, STORAGE_KEYS } from "../../../utils/constants";

const userdata = [
  {
    username: "thiru",
    password: "thiru12",
  },
  {
    username: "yuvi",
    password: "yuvi12",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const username = useRef(null);
  const password = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for stored user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setProfile(user);
        console.log("Stored user loaded:", user);
        // Redirect to home if already logged in
        navigate("/");
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
  }, [navigate]);

  function handleLogin() {
    if (!username.current.value || !password.current.value) {
      alert(MESSAGES.FILL_ALL_FIELDS);
      return;
    }

    const found = userdata.find(
      (item) => item.username === username.current.value
    );
    if (found && found.password === password.current.value) {
      const localUser = {
        provider: "local",
        name: username.current.value,
        email: `${username.current.value}@example.com`,
        username: username.current.value,
        loginAt: new Date().toISOString(),
      };

      setProfile(localUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(localUser));
      alert(`${MESSAGES.LOGIN_SUCCESS} Welcome ${username.current.value}!`);
      navigate("/");
    } else {
      alert(MESSAGES.INVALID_CREDENTIALS);
    }
  }

  function handleGoogleLoginSuccess(credentialResponse) {
    try {
      setLoading(true);
      console.log("Google login success:", credentialResponse);

      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      const decoded = JSON.parse(
        atob(credentialResponse.credential.split(".")[1])
      );
      console.log("Google user info decoded:", decoded);

      const googleUser = {
        provider: "google",
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        email_verified: decoded.email_verified,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        locale: decoded.locale,
        loginAt: new Date().toISOString(),
      };

      setProfile(googleUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(googleUser));
      console.log("Google user profile created:", googleUser);
      alert(`Welcome ${decoded.name}!`);
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      alert(`Failed to process Google login: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLoginError(error) {
    console.error("Google login failed:", error);
    alert("Google login failed. Please try again.");
    setLoading(false);
  }

  // GitHub OAuth Success Handler
  const handleGithubSuccess = async (response) => {
    try {
      setLoading(true);
      console.log("GitHub OAuth Success:", response);

      const result = await authService.githubAuth(response.code);
      if (result.success) {
        setProfile(result.user);
        alert(`Welcome ${result.user.name}!`);
        navigate("/");
      } else {
        alert("GitHub login failed. Please try again.");
      }
    } catch (error) {
      console.error("GitHub login error:", error);
      alert("GitHub login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubFailure = (response) => {
    console.error("GitHub OAuth Failed:", response);
    alert("GitHub login failed. Please try again.");
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="outer-layout">
        <div className="outer-logo">
          <h1>Nuark</h1>
        </div>
        <div className="login-container">
          <div className="login-inner">
            <h3 className="login-text">Signing in...</h3>
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
          <h3 className="login-text">Login</h3>

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
              ref={password}
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div
            className="element"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ cursor: "pointer", color: "#667eea", fontSize: "14px" }}
            >
              Forgot Password?
            </span>
            <Link
              to={"/register"}
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Sign Up
            </Link>
          </div>
          <div className="element">
            <button onClick={handleLogin}>Sign In</button>
          </div>
        </div>

        <div
          style={{
            margin: "20px 0",
            color: "#999",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          or continue with
        </div>

        <div className="social-logins">
          <div className="social-buttons" style={{ marginBottom: "10px" }}>
            <LoginGithub
              clientId={import.meta.env.VITE_GITHUB_CLIENT_ID}
              onSuccess={handleGithubSuccess}
              onFailure={handleGithubFailure}
              redirectUri=""
              buttonText="Login with GitHub"
            />
          </div>

          <div className="social-buttons">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              text="signin_with"
              theme="filled_blue"
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
