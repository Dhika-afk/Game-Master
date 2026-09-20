import {
  Product,
  ProductPrice,
  Booking,
  HeroVideo,
  CustomerReview,
  MediaItem,
  WebsiteSettings,
  AdminStats
} from './types.js';

const API_BASE = '/api';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function createProductApi(product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProductApi(id: string, updates: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProductApi(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

export async function fetchPrices(): Promise<ProductPrice[]> {
  const res = await fetch(`${API_BASE}/prices`);
  if (!res.ok) throw new Error('Failed to fetch prices');
  return res.json();
}

export async function createPriceApi(priceData: Partial<ProductPrice>): Promise<ProductPrice> {
  const res = await fetch(`${API_BASE}/prices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(priceData)
  });
  if (!res.ok) throw new Error('Failed to create price');
  return res.json();
}

export async function updatePriceApi(id: string, updates: Partial<ProductPrice>): Promise<ProductPrice> {
  const res = await fetch(`${API_BASE}/prices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update price');
  return res.json();
}

export async function deletePriceApi(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/prices/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete price');
  return res.json();
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/bookings`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function fetchBookingById(id: string): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Booking tidak ditemukan' }));
    throw new Error(err.error || 'Failed to fetch booking');
  }
  return res.json();
}

export async function createBookingApi(booking: {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productId: string;
  productName: string;
  duration: string;
  price: number;
  startDate: string;
  endDate: string;
  notes?: string;
}): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Gagal membuat booking' }));
    throw new Error(err.error || 'Failed to create booking');
  }
  return res.json();
}

export async function updateBookingStatusApi(
  id: string,
  status: Booking['status'],
  adminNotes?: string
): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, adminNotes })
  });
  if (!res.ok) throw new Error('Failed to update booking status');
  return res.json();
}

export async function deleteBookingApi(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete booking');
  return res.json();
}

export async function fetchHeroVideos(): Promise<HeroVideo[]> {
  const res = await fetch(`${API_BASE}/hero-videos`);
  if (!res.ok) throw new Error('Failed to fetch hero videos');
  return res.json();
}

export async function createHeroVideoApi(video: Partial<HeroVideo>): Promise<HeroVideo> {
  const res = await fetch(`${API_BASE}/hero-videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(video)
  });
  if (!res.ok) throw new Error('Failed to create hero video');
  return res.json();
}

export async function updateHeroVideoApi(id: string, updates: Partial<HeroVideo>): Promise<HeroVideo> {
  const res = await fetch(`${API_BASE}/hero-videos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update hero video');
  return res.json();
}

export async function deleteHeroVideoApi(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/hero-videos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete hero video');
  return res.json();
}

export async function fetchReviews(): Promise<CustomerReview[]> {
  const res = await fetch(`${API_BASE}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function createReviewApi(review: Partial<CustomerReview>): Promise<CustomerReview> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  if (!res.ok) throw new Error('Failed to create review');
  return res.json();
}

export async function updateReviewApi(id: string, updates: Partial<CustomerReview>): Promise<CustomerReview> {
  const res = await fetch(`${API_BASE}/reviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update review');
  return res.json();
}

export async function deleteReviewApi(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete review');
  return res.json();
}

export async function fetchMedia(): Promise<MediaItem[]> {
  const res = await fetch(`${API_BASE}/media`);
  if (!res.ok) throw new Error('Failed to fetch media');
  return res.json();
}

export async function createMediaApi(media: Partial<MediaItem>): Promise<MediaItem> {
  const res = await fetch(`${API_BASE}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(media)
  });
  if (!res.ok) throw new Error('Failed to create media');
  return res.json();
}

export async function deleteMediaApi(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/media/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete media');
  return res.json();
}

export async function fetchSettings(): Promise<WebsiteSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettingsApi(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export async function fetchStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export const fetchAdminStats = fetchStats;
export const createMediaItemApi = createMediaApi;
export const deleteMediaItemApi = deleteMediaApi;

export async function loginAdminApi(username: string, password: string): Promise<{
  success: boolean;
  token: string;
  user: { id: string; username: string; name: string };
}> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Login gagal' }));
    throw new Error(err.error || 'Login gagal');
  }
  return res.json();
}
