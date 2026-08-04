/**
 * -----------------------------------------------------------------------------
 * ShipSafe API Client Utilities — api.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Client-side API helpers for making authenticated requests.
 *   Provides type-safe API calls with error handling and CSRF protection.
 *
 * Why this exists:
 *   Client components need to make API calls to server routes.
 *   This centralizes request logic, error handling, and authentication.
 *
 * Security:
 *   - Includes CSRF token in requests
 *   - Handles authentication tokens
 *   - Safe error handling (no sensitive data leaked)
 *
 * Used by:
 *   - Client components making API calls
 *   - Form submissions
 *   - Data fetching hooks
 *
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// 1. API Response Types
// -----------------------------------------------------------------------------

/**
 * Standard API response structure.
 */
export interface APIResponse<T = unknown> {
  /**
   * Whether the request was successful
   */
  success: boolean;

  /**
   * Response data (if successful)
   */
  data?: T;

  /**
   * Error message (if failed)
   */
  error?: string;
}

/**
 * API error with status code.
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public data?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

// -----------------------------------------------------------------------------
// 2. API Request Options
// -----------------------------------------------------------------------------

/**
 * Options for API requests.
 */
export interface APIRequestOptions extends RequestInit {
  /**
   * Whether to include authentication token
   */
  requireAuth?: boolean;

  /**
   * Whether to include CSRF token
   */
  includeCSRF?: boolean;

  /**
   * Custom headers
   */
  headers?: HeadersInit;
}

// -----------------------------------------------------------------------------
// 3. Get CSRF Token
// -----------------------------------------------------------------------------

/**
 * getCSRFToken() — retrieves CSRF token from cookie.
 *
 * @returns CSRF token or null if not found
 */
export function getCSRFToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");
  const csrfCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("csrf_token_client=")
  );

  if (!csrfCookie) {
    return null;
  }

  return csrfCookie.split("=")[1]?.trim() || null;
}

// -----------------------------------------------------------------------------
// 4. Get Auth Token
// -----------------------------------------------------------------------------

/**
 * getAuthToken() — retrieves Firebase ID token for authentication.
 *
 * @returns ID token or null if not authenticated
 */
export async function getAuthToken(): Promise<string | null> {
  // Lazy import to avoid SSR issues
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const { getAuthInstance } = await import("@/lib/firebase/client");
    const auth = getAuthInstance();
    const user = auth.currentUser;

    if (!user) {
      return null;
    }

    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

// -----------------------------------------------------------------------------
// 5. API Client Function
// -----------------------------------------------------------------------------

/**
 * apiRequest() — makes an authenticated API request.
 *
 * This function:
 *   1. Adds authentication token (if required)
 *   2. Adds CSRF token (if required)
 *   3. Handles errors gracefully
 *   4. Returns typed response
 *
 * @param url - API endpoint URL
 * @param options - Request options
 * @returns Typed API response
 * @throws APIError if request fails
 */
export async function apiRequest<T = unknown>(
  url: string,
  options: APIRequestOptions = {}
): Promise<APIResponse<T>> {
  const {
    requireAuth = true,
    includeCSRF = true,
    headers = {},
    ...fetchOptions
  } = options;

  // Build headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Add authentication token
  if (requireAuth) {
    const token = await getAuthToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // Add CSRF token
  if (includeCSRF) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      requestHeaders["X-CSRF-Token"] = csrfToken;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
      credentials: "include", // Include cookies
    });

    // Parse response
    const data = await response.json().catch(() => ({}));

    // Handle non-OK responses
    if (!response.ok) {
      throw new APIError(
        data.error || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network or parsing error
    throw new APIError(
      error instanceof Error ? error.message : "Network error occurred",
      0
    );
  }
}

// -----------------------------------------------------------------------------
// 6. Convenience Methods
// -----------------------------------------------------------------------------

/**
 * apiGet() — makes a GET request.
 */
export async function apiGet<T = unknown>(
  url: string,
  options?: Omit<APIRequestOptions, "method" | "body">
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: "GET",
  });
}

/**
 * apiPost() — makes a POST request.
 */
export async function apiPost<T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<APIRequestOptions, "method" | "body">
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * apiPut() — makes a PUT request.
 */
export async function apiPut<T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<APIRequestOptions, "method" | "body">
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * apiPatch() — makes a PATCH request.
 */
export async function apiPatch<T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<APIRequestOptions, "method" | "body">
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/**
 * apiDelete() — makes a DELETE request.
 */
export async function apiDelete<T = unknown>(
  url: string,
  options?: Omit<APIRequestOptions, "method" | "body">
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: "DELETE",
  });
}

// -----------------------------------------------------------------------------
// 7. Error Handler Helper
// -----------------------------------------------------------------------------

/**
 * handleAPIError() — handles API errors consistently.
 *
 * @param error - Error to handle
 * @returns User-friendly error message
 */
export function handleAPIError(error: unknown): string {
  if (error instanceof APIError) {
    // Return user-friendly error message
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

