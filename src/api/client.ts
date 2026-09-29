/**
 * API Client - Abstraction layer for future Laravel backend integration.
 *
 * Currently uses mock data with simulated network delays.
 * Replace the mock implementations with real HTTP calls when the
 * Laravel API is ready.
 */

const SIMULATED_DELAY = 300;

function delay(ms: number = SIMULATED_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const api = {
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    await delay();
    // In production: return fetch(`/api${url}?${new URLSearchParams(params)}`).then(r => r.json())
    void url;
    void params;
    throw new ApiError(501, 'Not implemented - use mock API functions');
  },

  async post<T>(url: string, body?: unknown): Promise<T> {
    await delay();
    void url;
    void body;
    throw new ApiError(501, 'Not implemented - use mock API functions');
  },

  async put<T>(url: string, body?: unknown): Promise<T> {
    await delay();
    void url;
    void body;
    throw new ApiError(501, 'Not implemented - use mock API functions');
  },

  async delete<T>(url: string): Promise<T> {
    await delay();
    void url;
    throw new ApiError(501, 'Not implemented - use mock API functions');
  },
};
