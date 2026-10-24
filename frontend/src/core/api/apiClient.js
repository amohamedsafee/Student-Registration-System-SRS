import axios from 'axios';

/**
 * Standardized client-side API error wrapper
 */
export class ApiError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', status = 500, details = null, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.originalError = originalError;
  }
}

// 1. Create configured Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 2. Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Can attach tracing or custom headers here
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Global Error Handler)
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let message = 'An unexpected network error occurred. Please check your connection.';
    let code = 'NETWORK_ERROR';
    let status = 500;
    let details = null;

    if (error.response) {
      status = error.response.status;
      const data = error.response.data;

      // Extract server standardized error format: { error: { code, message, details } }
      if (data && data.error) {
        message = data.error.message || message;
        code = data.error.code || code;
        details = data.error.details || null;
      } else if (data && data.message) {
        message = data.message;
      }

      // Handle specific HTTP status codes
      switch (status) {
        case 401:
          // Unauthorized / Session expired
          code = code || 'UNAUTHORIZED';
          // Dispatch session expired event so UI can react
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('llc:auth-expired', {
                detail: { message, status },
              })
            );
          }
          break;

        case 403:
          code = code || 'FORBIDDEN';
          break;

        case 404:
          code = code || 'NOT_FOUND';
          break;

        case 409:
          code = code || 'CONFLICT';
          break;

        case 429:
          code = code || 'RATE_LIMITED';
          message = message || 'Too many requests. Please slow down and try again.';
          break;

        case 500:
        default:
          code = code || 'SERVER_ERROR';
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      message = 'Server is unreachable. Please verify the backend API is running.';
      code = 'SERVER_UNREACHABLE';
    }

    // Broadcast global error event for optional toast/notification listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('llc:api-error', {
          detail: { message, code, status, details },
        })
      );
    }

    const apiError = new ApiError(message, code, status, details, error);
    return Promise.reject(apiError);
  }
);

export default apiClient;
