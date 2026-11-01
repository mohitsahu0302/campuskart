import { Listing, Pagination, User, FilterState } from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  status: number;
  errors?: any;

  constructor(message: string, status: number, errors?: any) {
    super(message);
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Ensure JWT Authorization header is sent (survives cross-origin and third-party cookie blocking)
  if (typeof window !== 'undefined' && !headers.has('Authorization')) {
    const token = localStorage.getItem('campuskart_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensures httpOnly cookies are passed
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.message || 'An error occurred while connecting to campus server',
      response.status,
      data.errors
    );
  }

  return data;
}

export const authApi = {
  signup: (userData: any) =>
    fetcher<{ success: boolean; data: { user: User; token: string } }>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    ),

  login: (credentials: { email: string; password: string }) =>
    fetcher<{ success: boolean; data: { user: User; token: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    ),

  logout: () =>
    fetcher<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () =>
    fetcher<{ success: boolean; data: { user: User } }>('/auth/me'),
};

export const listingsApi = {
  getListings: (filters: Partial<FilterState> = {}, page = 1, limit = 12) => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category && filters.category !== 'All')
      params.set('category', filters.category);
    if (filters.condition && filters.condition !== 'All')
      params.set('condition', filters.condition);
    if (filters.hostelArea && filters.hostelArea !== 'All')
      params.set('hostelArea', filters.hostelArea);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.status) params.set('status', filters.status);
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    return fetcher<{
      success: boolean;
      data: { items: Listing[]; pagination: Pagination };
    }>(`/listings?${params.toString()}`);
  },

  getListing: (id: string) =>
    fetcher<{ success: boolean; data: { listing: Listing } }>(
      `/listings/${id}`
    ),

  createListing: (data: any) =>
    fetcher<{ success: boolean; message: string; data: { listing: Listing } }>(
      '/listings',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  updateListing: (id: string, data: any) =>
    fetcher<{ success: boolean; message: string; data: { listing: Listing } }>(
      `/listings/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    ),

  deleteListing: (id: string) =>
    fetcher<{ success: boolean; message: string }>(`/listings/${id}`, {
      method: 'DELETE',
    }),

  toggleSold: (id: string) =>
    fetcher<{ success: boolean; message: string; data: { listing: Listing } }>(
      `/listings/${id}/sold`,
      {
        method: 'PATCH',
      }
    ),

  getMyListings: () =>
    fetcher<{ success: boolean; data: { listings: Listing[] } }>('/listings/my'),

  reportListing: (id: string, reason: string, details?: string) =>
    fetcher<{ success: boolean; message: string }>(`/listings/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details }),
    }),
};

export const userApi = {
  toggleSaved: (listingId: string) =>
    fetcher<{
      success: boolean;
      message: string;
      data: { isSaved: boolean; savedListings: string[] };
    }>(`/users/saved/${listingId}`, {
      method: 'POST',
    }),

  getSaved: () =>
    fetcher<{ success: boolean; data: { savedListings: Listing[] } }>(
      '/users/saved'
    ),
};

export const uploadApi = {
  uploadImages: (formData: FormData) =>
    fetcher<{
      success: boolean;
      message: string;
      data: { urls: string[] };
    }>('/upload', {
      method: 'POST',
      body: formData,
    }),
};
