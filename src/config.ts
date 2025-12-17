/**
 * PharmAgent Configuration
 *
 * Configure the application behavior here.
 */

export const config = {
  /**
   * Backend API URL
   * Change this if your Flask backend is running on a different host/port
   */
  BACKEND_URL: "http://127.0.0.1:5000",

  /**
   * Auto-fallback to mock data if backend is unavailable
   * When true: Seamlessly switches to local database if backend connection fails
   * When false: Shows error message and requires backend to be running
   */
  AUTO_FALLBACK_TO_MOCK: true,

  /**
   * Request timeout in milliseconds
   * How long to wait for backend response before falling back to mock data
   */
  BACKEND_TIMEOUT: 60000, // 60 seconds

  /**
   * Enable verbose logging
   * Shows detailed API request/response logs in browser console
   */
  DEBUG_MODE: false,
};
