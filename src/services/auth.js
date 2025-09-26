/* src/services/auth.js */
import { API_CONFIG, STORAGE_KEYS } from "../utils/constants";

export const authService = {
  // Local registration
  register: async (userData) => {
    try {
      const { username, email, password } = userData;

      // Simulate API call
      const newUser = {
        id: Date.now(),
        provider: "local",
        username,
        email,
        name: username,
        registeredAt: new Date().toISOString(),
        isVerified: false,
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  },

  // Local login
  login: async (credentials) => {
    try {
      const { username, password } = credentials;

      // Simulate API call
      const user = {
        id: Date.now(),
        provider: "local",
        username,
        email: `${username}@example.com`,
        name: username,
        loginAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  },

  // GitHub OAuth
  githubAuth: async (code) => {
    try {
      // In a real app, you'd exchange the code for a token
      const githubUser = {
        id: Date.now(),
        provider: "github",
        login: "authenticated_user",
        name: "GitHub Authenticated User",
        email: "user@github.com",
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
        bio: "Successfully authenticated via GitHub OAuth",
        location: "Global",
        company: "GitHub",
        blog: "https://github.com",
        public_repos: Math.floor(Math.random() * 50) + 5,
        public_gists: Math.floor(Math.random() * 20),
        followers: Math.floor(Math.random() * 200) + 20,
        following: Math.floor(Math.random() * 100) + 10,
        created_at: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3
        ).toISOString(),
        updated_at: new Date().toISOString(),
        html_url: "https://github.com/authenticated_user",
        oauth_code: code,
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(githubUser));
      return { success: true, user: githubUser };
    } catch (error) {
      console.error("GitHub auth error:", error);
      return { success: false, error: error.message };
    }
  },

  // Google OAuth
  googleAuth: async (credential) => {
    try {
      const decoded = JSON.parse(atob(credential.split(".")[1]));

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
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(googleUser));
      return { success: true, user: googleUser };
    } catch (error) {
      console.error("Google auth error:", error);
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    return { success: true };
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },
};
