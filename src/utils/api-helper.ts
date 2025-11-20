// API Helper utilities for making HTTP requests
// Provides standardized error handling and response parsing

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();

    return {
      success: true,
      data,
      message: data.message,
    };
  } catch (error) {
    console.error('API Request Error:', error);

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'GET',
  });
}

export async function apiPost<T>(
  url: string,
  body: any
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiPut<T>(
  url: string,
  body: any
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'DELETE',
  });
}
