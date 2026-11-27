import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * -----------------------------------------------------------------------------
 * 1. TOKEN STORAGE (Our Browser Safe)
 * -----------------------------------------------------------------------------
 * What it is:
 * A helper object that saves, reads, and deletes our admin JWT VIP pass
 * in the browser's localStorage.
 *
 * Why we use it:
 * When an admin logs in, the backend gives us a secret JWT token.
 * By keeping it in localStorage, the user stays logged in even if they refresh
 * the webpage.
 */
const TOKEN_KEY = 'ivr_admin_jwt';

export const tokenStorage = {
  // Read the saved token from browser storage
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  // Save the new token when the user logs in
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Storage might be disabled or full
    }
  },

  // Remove the token when the user logs out or session expires
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Storage unavailable
    }
  },
};

/**
 * -----------------------------------------------------------------------------
 * 2. AXIOS CLIENT (Our Main Messenger)
 * -----------------------------------------------------------------------------
 * What it is:
 * A pre-configured Axios instance that all frontend API calls use.
 *
 * Why we use it:
 * Instead of typing the full server URL 'http://localhost:3001/api' in every file,
 * this client sets the base URL, standard JSON headers, and timeout once.
 */
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Wait at most 15 seconds for a response
});

/**
 * -----------------------------------------------------------------------------
 * 3. REQUEST INTERCEPTOR (Attaching the VIP Pass)
 * -----------------------------------------------------------------------------
 * What it does:
 * Every time the frontend makes an HTTP request to the backend, this function
 * runs right before the request leaves the browser.
 *
 * How it works:
 * 1. Checks if we have an admin JWT token in tokenStorage.
 * 2. If yes, it adds "Authorization: Bearer <token>" to the request headers.
 * 3. The backend guards inspect this header to know who is calling.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * -----------------------------------------------------------------------------
 * 4. RESPONSE INTERCEPTOR (Handling Expired Sessions)
 * -----------------------------------------------------------------------------
 * What it does:
 * When the server answers our request, this function inspects the reply.
 *
 * How error handling works:
 * - If everything is fine (HTTP 200/201), the response passes right through.
 * - If the server replies with 401 Unauthorized (token expired or fake),
 *   it clears our saved token and immediately redirects the user to the /login page.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isAuthPage =
        window.location.pathname === '/login' ||
        window.location.pathname === '/register';

      if (!isAuthPage) {
        tokenStorage.clear();
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

/**
 * -----------------------------------------------------------------------------
 * 5. ERROR MESSAGE EXTRACTOR
 * -----------------------------------------------------------------------------
 * What it does:
 * Takes any unexpected error from Axios or JavaScript and converts it
 * into a clean, human-readable error string for toast alerts.
 *
 * Why we use it:
 * NestJS validation might return an array of strings like ["Price must be positive", "Name is required"].
 * This helper joins them cleanly so the user knows exactly what went wrong.
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as { message?: string | string[]; error?: string };
    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    }
    if (typeof data.message === 'string') {
      return data.message;
    }
    if (typeof data.error === 'string') {
      return data.error;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}
