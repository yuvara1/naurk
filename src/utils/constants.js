/* src/utils/constants.js */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CLASSIFICATION: "/classification",
};

export const API_CONFIG = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID,
  GITHUB_SECRET: import.meta.env.VITE_GITHUB_SECRET,
};

export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
};

export const MESSAGES = {
  REGISTRATION_SUCCESS: "Registration successful! Welcome to Nuark.",
  LOGIN_SUCCESS: "Login successful! Welcome back.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  INVALID_CREDENTIALS: "Invalid username or password.",
  PASSWORDS_DONT_MATCH: "Passwords do not match.",
  FILL_ALL_FIELDS: "Please fill in all fields.",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters long.",
};
