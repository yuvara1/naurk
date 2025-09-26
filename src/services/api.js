/* src/services/api.js */
import { API_CONFIG } from "../utils/constants";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const apiService = {
  // Generic API call method
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  },

  // GET request
  get: (endpoint, headers = {}) => {
    return apiService.makeRequest(endpoint, {
      method: "GET",
      headers,
    });
  },

  // POST request
  post: (endpoint, data, headers = {}) => {
    return apiService.makeRequest(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
  },

  // PUT request
  put: (endpoint, data, headers = {}) => {
    return apiService.makeRequest(endpoint, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  delete: (endpoint, headers = {}) => {
    return apiService.makeRequest(endpoint, {
      method: "DELETE",
      headers,
    });
  },
};
